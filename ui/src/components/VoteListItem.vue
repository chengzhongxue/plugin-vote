<script lang="ts" setup>
import {
  VEntity,
  VEntityField,
  VStatusDot,
  VDropdownItem,
  VSpace,
  Toast,
} from "@halo-dev/components";
import {type Vote, VoteSpecTimeLimitEnum, VoteSpecTypeEnum} from "@/api/generated";
import {computed} from "vue";
import {useClipboard} from "@vueuse/core";
import SolarCopyOutline from '~icons/solar/copy-outline?width=1.2em&height=1.2em';
import {useRouter} from "vue-router";
import { utils } from '@halo-dev/ui-shared'

const props = withDefaults(
  defineProps<{
    vote: Vote;
    isSelected?: boolean;
    uc?: boolean;
  }>(),
  {
    isSelected: false,
    uc: true,
  },
);

const router = useRouter();

const emit = defineEmits<{
  (event: "editing", vote: Vote): void;
  (event: "delete", vote: Vote): void;
}>();

const {copy} = useClipboard({
  legacy: true
})

const copyVote = (name:string) => {
  const vote = `<vote-block id="${name}"></vote-block>`;
  copy(vote).then( () => {
      Toast.success("复制成功，可以直接在默认编辑器粘贴或者放置在 HTML 代码中。")
    }
  )
}

const timeLimitText = computed(() => {
  if (props.vote.spec.timeLimit != VoteSpecTimeLimitEnum.Permanent) {
    return utils.date.format(props.vote.spec.endDate)+" 前可投票";
  }
  return "永久";
})

const typeText = (type:string) =>{
  if (type == VoteSpecTypeEnum.Multiple) {
    return '多选';
  }
  if (type == VoteSpecTypeEnum.Pk) {
    return '双选pk';
  }
  if (type == VoteSpecTypeEnum.Single) {
    return '单选';
  }
  return '未知';
}

function routeToVoteDetail() {
  props.uc ? router.push({
      name: "UcVoteDetail",
      params: { name: props.vote.metadata.name },
    }) :
  router.push({
    name: "VoteDetail",
    params: { name: props.vote.metadata.name },
  });
}

</script>
<template>
  <VEntity :is-selected="isSelected">
    <template #checkbox>
      <HasPermission :permissions="['plugin:vote:manage','uc:plugin:vote:manage']">
        <slot name="checkbox" />
      </HasPermission>
    </template>
    <template #start>
      <VEntityField
        :title="vote.spec.title"
        :route="{
          name: uc ? 'UcVoteDetail' :'VoteDetail',
          params: { 
            name: vote.metadata.name,
          },
        }"
        width="15rem"
      >
        <template #description>
          <div class=":uno: flex flex-col gap-1.5">
            <VSpace class=":uno: flex-wrap !gap-y-1">
              <p class=":uno: inline-flex flex-wrap gap-1 text-xs text-gray-500" v-if="!uc">
                创建人：<RouterLink class=":uno: hover:text-gray-900" :to="{name: 'UserDetail',params: {name: vote.spec.owner},}">{{ vote.spec.owner }}</RouterLink>
              </p>
              <span v-if="vote.spec.remark" class=":uno: text-xs text-gray-500">备注：{{ vote.spec.remark }}</span>
            </VSpace>
          </div>
        </template>
      </VEntityField>
    </template>
    <template #end>
      <VEntityField>
        <template #description>
          <span class=":uno: truncate text-xs tabular-nums text-gray-500">
            {{vote.metadata.name}}
          </span>
          <SolarCopyOutline class=":uno: ml-0.5 h-3 w-3 cursor-pointer hover:text-sky-500" @click="copyVote(vote.metadata.name)" />
        </template>
      </VEntityField>
      <VEntityField
        :description="timeLimitText"
      />
      <VEntityField
        :description="typeText(vote.spec.type)"
      />
      <VEntityField
      >
        <template #description>
          <VStatusDot
            :state="vote.spec.hasEnded ? 'warning' : 'success'"
            :animate="!vote.spec.hasEnded"
            :text="vote.spec.hasEnded ? '结束' : '进行中'"
          />
        </template>
      </VEntityField>
      <VEntityField v-if="vote.metadata.deletionTimestamp">
        <template #description>
          <VStatusDot
            v-tooltip="'删除中'"
            state="warning"
            text="删除中"
          />
        </template>
      </VEntityField>
      <VEntityField>
        <template #description>
          <span class=":uno: truncate text-xs tabular-nums text-gray-500" v-tooltip="'投票开始时间'">
            {{ utils.date.format(vote.spec.startDate) }}
          </span>
        </template>
      </VEntityField>
    </template>
    <template #dropdownItems>
      <HasPermission :permissions="['plugin:vote:manage','uc:plugin:vote:manage']">
        <VDropdownItem @click="routeToVoteDetail">
          投票统计
        </VDropdownItem>
        <VDropdownItem @click="emit('editing', vote)">
          编辑
        </VDropdownItem>
        <VDropdownItem type="danger" @click="emit('delete', vote)">
          删除
        </VDropdownItem>
      </HasPermission>
    </template>
  </VEntity>
</template>
