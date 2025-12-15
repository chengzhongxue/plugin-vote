<script setup lang="ts">
import {useRouteQuery} from "@vueuse/router";
import {computed, ref, watch} from "vue";
import {useQuery, useQueryClient} from "@tanstack/vue-query";
import {
  IconAddCircle,
  VPageHeader,
  VCard,
  VLoading,
  VEmpty,
  VSpace,
  VButton,
  VPagination,
  IconRefreshLine, 
  Dialog, 
  Toast,
  VEntityContainer
} from "@halo-dev/components";
import {voteApiClient, voteCoreApiClient} from "@/api";
import VoteListItem from "@/components/VoteListItem.vue";
import type {Vote} from "@/api/generated";
import VoteEditingModal from "@/components/VoteEditingModal.vue";
import FluentVote20Regular from '~icons/fluent/vote-20-regular?width=1.2em&height=1.2em';

const queryClient = useQueryClient();

const editingModal = ref(false);
const checkAll = ref(false);
const selectedVote = ref<Vote>();
const selectedVoteNames = ref<string[]>([]);

const page = useRouteQuery<number>("page", 1, {
  transform: Number,
});
const size = useRouteQuery<number>("size", 20, {
  transform: Number,
});
const selectedSort = useRouteQuery<string | undefined>("sort");
const selectedType = useRouteQuery<string | undefined>("type");
const selectedHasEnded = useRouteQuery<string | undefined>("hasEnded");
const keyword = useRouteQuery<string>("keyword", "");
const total = ref(0);

watch(
  () => [
    selectedType.value,
    selectedHasEnded.value,
    selectedSort.value,
    keyword.value,
  ],
  () => {
    page.value = 1;
  },
);

const handleClearFilters = () => {
  selectedType.value = undefined;
  selectedHasEnded.value = undefined;
  selectedSort.value = undefined;
};

const hasFilters = computed(() => {
  return (
    selectedType.value ||
    selectedHasEnded.value ||
    selectedSort.value
  );
});

const {
  data: votes,
  isLoading,
  isFetching,
  refetch,
} = useQuery({
  queryKey: [
    "votes",
    page,
    size,
    keyword,
    selectedSort,
    selectedType,
    selectedHasEnded,
  ],
  queryFn: async () => {

    const { data } = await voteApiClient.vote.listVotes({
      page: page.value,
      size: size.value,
      keyword: keyword.value,
      sort: [selectedSort.value].filter(Boolean) as string[],
      type: selectedType.value,
      hasEnded: selectedHasEnded.value,
    });

    total.value = data.total;
    return data;
  },
  refetchInterval: (data) => {
    const hasDeletingVote = data?.items.some(
      (vote) => vote?.metadata.deletionTimestamp,
    );
    return hasDeletingVote ? 1000 : false;
  },
  onSuccess: (data) => {
    page.value = data.page;
    size.value = data.size;
  }
});

const handleOpenEditingModal = (vote?: Vote) => {
  selectedVote.value = vote;
  editingModal.value = true;
};

// Selection
const handleCheckAllChange = (e: Event) => {
  const { checked } = e.target as HTMLInputElement;

  if (checked) {
    selectedVoteNames.value =
      votes.value?.items.map((vote) => {
        return vote.metadata.name;
      }) || [];
  } else {
    selectedVoteNames.value = [];
  }
};

const checkSelection = (vote: Vote) => {
  return (
    vote.metadata.name === selectedVote.value?.metadata.name || selectedVoteNames.value.includes(vote.metadata.name)
  );
};

watch(
  () => selectedVoteNames.value,
  (newValue) => {
    checkAll.value = newValue.length === votes.value?.items.length;
  }
);

const handleDeleteInBatch = async () => {
  Dialog.warning({
    title: '确定要删除选中的投票吗？',
    description: '该操作不可恢复。',
    confirmType: "danger",
    confirmText: '确定',
    cancelText: '取消',
    onConfirm: async () => {
      try {
        const promises = selectedVoteNames.value.map((name) => {
          return voteCoreApiClient.vote.deleteVote(
            {
              name: name
            }
          );
        });
        await Promise.all(promises);
        selectedVoteNames.value = [];

        Toast.success('删除成功');
      } catch (e) {
        console.error("Failed to delete vote", e);
      } finally {
        refetch();
      }
    },
  });
};

const handleDelete = async (vote?: Vote) => {
  Dialog.warning({
    title: "确定要删除该投票吗？",
    description: "删除之后将无法恢复。",
    confirmType: "danger",
    confirmText: "确定",
    cancelText: "取消",
    onConfirm: async () => {
      try {
        await voteCoreApiClient.vote.deleteVote({
          name: vote?.metadata.name as string
        })
        Toast.success("删除成功");
      } catch (error) {
        console.error("Failed to delete vote",error);
      } finally {
        queryClient.invalidateQueries({ queryKey: ["votes"] });
      }
    },
  });
};

const onEditingModalClose = () => {
  selectedVote.value = undefined;
  editingModal.value = false;
  refetch();
};

</script>
<template>
  <VoteEditingModal
    v-if="editingModal"
    :vote="selectedVote"
    :uc="false"
    @close="onEditingModalClose"
  />
  <VPageHeader title="投票管理">
    <template #icon>
      <FluentVote20Regular class=":uno: mr-2 self-center" />
    </template>
    <template #actions>
      <VButton
        v-permission="['plugin:vote:manage']"
        type="secondary"
        @click="editingModal = true"
      >
        <template #icon>
          <IconAddCircle class=":uno: h-full w-full" />
        </template>
        新建
      </VButton>
    </template>
  </VPageHeader>
  <div class=":uno: m-0 md:m-4">
    <VCard :body-class="[':uno: !p-0']">
      <template #header>
        <div class=":uno: block w-full bg-gray-50 px-4 py-3">
          <div
            class=":uno: relative flex flex-col flex-wrap items-start gap-4 sm:flex-row sm:items-center"
          >
            <div
              v-permission="['plugin:vote:manage']"
              class=":uno: hidden items-center sm:flex"
            >
              <input
                v-model="checkAll"
                type="checkbox"
                @change="handleCheckAllChange"
              />
            </div>
            <div class=":uno: flex w-full flex-1 items-center sm:w-auto">
              <SearchInput
                v-if="!selectedVoteNames.length"
                v-model="keyword" />
              <VSpace v-else>
                <VButton type="danger" @click="handleDeleteInBatch">
                  删除
                </VButton>
              </VSpace>
            </div>
            <VSpace spacing="lg" class=":uno: flex-wrap">
              <FilterCleanButton
                v-if="hasFilters"
                @click="handleClearFilters"
              />
              <FilterDropdown
                v-model="selectedType"
                label="类型"
                :items="[
                  {
                    label: '全部',
                    value: undefined,
                  },
                  {
                    label: '单选',
                    value: 'single',
                  },
                  {
                    label: '多选',
                    value: 'multiple',
                  },
                  {
                    label: '双选PK',
                    value: 'pk',
                  },
        
                ]"
              />
              <FilterDropdown
                v-model="selectedHasEnded"
                label="状态"
                :items="[
                  {
                    label: '全部',
                    value: undefined,
                  },
                  {
                    label: '进行中',
                    value: 'false',
                  },
                  {
                    label: '结束',
                    value: 'true',
                  },
        
                ]"
              />
              <FilterDropdown
                v-model="selectedSort"
                label="排序"
                :items="[
                  {
                    label: '默认',
                  },
                  {
                    label: '较近创建',
                    value: 'metadata.creationTimestamp,desc',
                  },
                  {
                    label: '较早创建',
                    value: 'metadata.creationTimestamp,asc',
                  },
                ]"
              />
              <div class=":uno: flex flex-row gap-2">
                <div
                  class=":uno: group cursor-pointer rounded p-1 hover:bg-gray-200"
                  @click="refetch()"
                >
                  <IconRefreshLine
                    v-tooltip="'刷新'"
                    :class="{ 'animate-spin text-gray-900': isFetching }"
                    class=":uno: h-4 w-4 text-gray-600 group-hover:text-gray-900"
                  />
                </div>
              </div>
            </VSpace>
          </div>
        </div>
      </template>
      <VLoading v-if="isLoading" />
      <Transition v-else-if="!votes?.items.length" appear name="fade">
        <VEmpty
          message="你可以尝试刷新或者新建投票"
          title="当前没有投票"
        >
          <template #actions>
            <VSpace>
              <VButton @click="refetch">
                刷新
              </VButton>
              <VButton
                v-permission="['plugin:vote:manage']"
                type="secondary" @click="editingModal = true">
                <template #icon>
                  <IconAddCircle class=":uno: h-full w-full" />
                </template>
                新建
              </VButton>
            </VSpace>
          </template>
        </VEmpty>
      </Transition>
      <Transition v-else appear name="fade">
        <VEntityContainer>
          <VoteListItem
            v-for="vote in votes?.items" :key="vote.metadata.name"
            :vote="vote"
            :is-selected="checkSelection(vote)"
            :uc="false"
            @editing="handleOpenEditingModal"
            @delete="handleDelete"
          >
            <template #checkbox>
              <input
                v-model="selectedVoteNames"
                :value="vote.metadata.name"
                name="comment-checkbox"
                type="checkbox"
              />
            </template>
          </VoteListItem>
        </VEntityContainer>
      </Transition>
      <template #footer>
        <VPagination
          v-model:page="page"
          v-model:size="size"
          page-label="页"
          size-label="条 / 页"
          :total-label="`共 ${total} 项数据`"
          :total="total"
          :size-options="[20, 30, 50, 100]"
        />
      </template>
    </VCard>
  </div>

</template>
