<script lang="ts" setup>

import {computed, ref, watch} from "vue";
import {IconRefreshLine, VButton, VEmpty, VModal, VSpace} from "@halo-dev/components";
import {useQuery} from "@tanstack/vue-query";
import {voteApiClient, voteUcApiClient} from "@/api";
import VoteRender from "@/editor/VoteRender.vue";
import {useRouteQuery} from "@vueuse/router";

const emit = defineEmits<{
  (event: "close"): void;
  (event: "select", value: string): void;
}>();

let path = window.document.location.pathname

const modal = ref<InstanceType<typeof VModal> | null>(null);

const selectedSort = useRouteQuery<string | undefined>("sort");
const selectedType = useRouteQuery<string | undefined>("type");
const selectedHasEnded = useRouteQuery<string | undefined>("hasEnded");
const keyword = useRouteQuery<string>("keyword", "");

watch(
  () => [
    selectedType.value,
    selectedHasEnded.value,
    selectedSort.value,
    keyword.value,
  ],
  () => {
    
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

const {data: voteList, isLoading, isFetching, refetch} = useQuery({
  queryKey: [
    "vote-editor",
    keyword,
    selectedSort,
    selectedType,
    selectedHasEnded,
  ],
  queryFn: async () => {
    const {data} = path == '/console/posts/editor' ? await voteApiClient.vote.listVotes({
      page: 0,
      size: 0,
      keyword: keyword.value,
      sort: [selectedSort.value].filter(Boolean) as string[],
      type: selectedType.value,
      hasEnded: selectedHasEnded.value,
    }) : await voteUcApiClient.vote.listMyVotes({
      page: 0,
      size: 0,
      keyword: keyword.value,
      sort: [selectedSort.value].filter(Boolean) as string[],
      type: selectedType.value,
      hasEnded: selectedHasEnded.value,
    });
    return data
  },
  keepPreviousData: true,
});

const id = ref("");

function handleSubmit() {
  emit("select", id.value); 
  modal.value?.close();
}

</script>

<template>
  <VModal
    ref="modal"
    title="选择投票"
    :width="1600"
    layer-closable
    height="calc(100vh - 20px)"
    mount-to-body
    @close="emit('close')">

    <div class=":uno: block w-full bg-gray-50 px-4 py-3 mb-2">
      <div
        class=":uno: relative flex flex-col flex-wrap items-start gap-4 sm:flex-row sm:items-center"
      >
        <div class=":uno: flex w-full flex-1 items-center sm:w-auto">
          <SearchInput
            v-model="keyword" />
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
                :class="{ ':uno: animate-spin text-gray-900': isFetching }"
                class=":uno: h-4 w-4 text-gray-600 group-hover:text-gray-900"
              />
            </div>
          </div>
        </VSpace>
      </div>
    </div>
    
    <div>
      <VLoading
        v-if="isLoading"
      />
      <div v-if="voteList?.total" class=":uno: grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <div 
          v-for="vote in voteList?.items" :key="vote.metadata.name"
          :class="[':uno: max-h-96 cursor-pointer overflow-auto rounded border border-gray-200 p-4 transition-all hover:border-blue-500',{':uno: !border-blue-500': id === vote.metadata.name}]"
          @click="id = vote.metadata.name"
        >
          <VoteRender :id="vote.metadata.name" />
          <div class=":uno: flex items-center text-sm pt-3" v-if="path == '/console/posts/editor'" >
            <span class=":uno: flex-1"></span>
            <span class=":uno: text-gray-400">{{'创建人：' + vote.spec.owner}}</span>
          </div>
        </div>
      </div>
      <VEmpty
        v-else
        message="当前没有投票，你可以尝试刷新或者新建投票"
        title="没有投票"
      >
        <template #actions>
          <VSpace>
            <VButton :loading="isFetching" @click="refetch">
              刷新
            </VButton>
            <VButton
              v-permission="['plugin:vote:manage','uc:plugin:vote:manage']"
              type="secondary" 
              @click="$router.push('/vote')"
            > 
              去新建
            </VButton>
          </VSpace>
        </template>
      </VEmpty>
    </div>
    <template #footer>
      <VSpace>
        <VButton
          type="secondary"
          :disabled="!id"
          @click="handleSubmit"
        >
          选择
        </VButton>
        <VButton @click="modal?.close()">
          关闭
        </VButton>
      </VSpace>
    </template>
  </VModal>
</template>
