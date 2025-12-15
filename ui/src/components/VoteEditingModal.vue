<script lang="ts" setup>
import { computed, ref, watch } from "vue";

import {
  Toast, 
  VAlert,
  VButton,
  VModal,
  VSpace,
} from "@halo-dev/components";
import { cloneDeep } from "lodash-es";
import {type Vote, VoteSpecTimeLimitEnum, VoteSpecTypeEnum} from "@/api/generated";
import SubmitButton from "@/components/button/SubmitButton.vue";
import {voteApiClient, voteUcApiClient} from "@/api";
import {submitForm} from "@formkit/core";
import { utils } from '@halo-dev/ui-shared'

const props = withDefaults(
  defineProps<{
    vote?: Vote;
    uc?: boolean;
  }>(),
  {
    vote: undefined,
    uc: true,
  }
);

const emit = defineEmits<{
  (event: "close"): void;
}>();


const formState = ref<Vote>({
  spec: {
    title: "",
    remark: undefined,
    type: VoteSpecTypeEnum.Single,
    maxVotes: undefined,
    options: [
      {
        title:""
      }
    ],
    timeLimit:VoteSpecTimeLimitEnum.Seven,
    startDate: undefined,
    endDate: undefined,
    hasEnded: false,
    canAnonymously: false,
    canSeeVoters: false,
  },
  apiVersion: "vote.kunkunyu.com/v1alpha1",
  kind: "Vote",
  metadata: {
    generateName: "vote-",
    name: "",
  },
});

const modal = ref<InstanceType<typeof VModal> | null>(null);

const saving = ref(false);

const isUpdateMode = computed(() => !!props.vote);

const modalTitle = computed(() => {
  return isUpdateMode.value
    ? '编辑投票'
    : '新建投票';
});

const handleSaveVote = async () => {

  let startDate = formState.value.spec.startDate
  if (startDate) {
    formState.value.spec.startDate = startDate ? utils.date.toISOString(startDate) : undefined;
  }
  let endDate = formState.value.spec.endDate
  if (endDate) {
    formState.value.spec.endDate = endDate ? utils.date.toISOString(endDate) : undefined;
  }
  
  try {
    
    saving.value = true;
    if (isUpdateMode.value) {
      if (props.uc) {
        await voteUcApiClient.vote.updateMyVote({
          name: formState.value.metadata.name,
          vote: formState.value,
        });
      }else {
        await voteApiClient.vote.updateVote({
          name: formState.value.metadata.name,
          vote: formState.value,
        });
      }
    } else {
      if (props.uc) {
        await voteUcApiClient.vote.createMyVote({
          vote: formState.value,
        });
      }else {
        await voteApiClient.vote.createVote({
          vote: formState.value,
        });
      }
    }
    
    modal.value?.close();
    Toast.success('保存成功');
  } catch (error) {
    console.error("Failed to create vote", error);
  } finally {
    saving.value = false;
  }
};

const handleSubmit = () => {
  submitForm("vote-form");
};

watch(
  () => props.vote,
  (vote) => {
    if (vote) {
      formState.value = cloneDeep(vote);
      let startDate = formState.value.spec.startDate
      if (startDate) {
        formState.value.spec.startDate = startDate ? utils.date.toDatetimeLocal(startDate) : undefined;
      }
      let endDate = formState.value.spec.endDate
      if (endDate) {
        formState.value.spec.endDate = endDate ? utils.date.toDatetimeLocal(endDate) : undefined;
      }
    }
  },
  {
    immediate: true,
  }
);


const voteCount  = computed(() => props.vote?.stats?.voteCount || 0);

</script>
<template>
  <VModal 
    ref="modal" 
    :title="modalTitle" 
    :width="530" 
    @close="emit('close')">
    
    <FormKit
      id="vote-form"
      type="form"
      name="vote-form"
      :config="{ validationVisibility: 'submit' }"
      @submit="handleSaveVote"
    >
      <VAlert
        v-if="isUpdateMode && voteCount > 0"
        class="mt-3"
        type="warning"
        title="投票已开始，无法修改部分内容"
        :closable="false"
      />
      <FormKit
        v-model="formState.spec.title"
        name="title"
        label="标题"
        type="text"
        validation="required|length:0,20"
      ></FormKit>
      <FormKit
        v-model="formState.spec.remark"
        name="remark"
        label="备注"
        type="textarea"
        validation="length:0,128"
        :validation-messages="{
          matches: '请输入不超过128个字符的名称'
        }"
      />
      <FormKit
        v-model="formState.spec.type"
        :options="[
              { label: '单选', value: 'single' },
              { label: '多选', value: 'multiple' },
              { label: '双选PK', value: 'pk' }
            ]"
        label="投票类型"
        type="radio"
        name="type"
        :disabled="voteCount > 0"
      ></FormKit>
      <FormKit
        v-if="formState.spec.type == 'multiple'"
        v-model="formState.spec.maxVotes"
        name="maxVotes"
        label="多选票数"
        type="number"
        value="0"
        min="2"
        validation="required"
        number="integer"
        :disabled="voteCount > 0"
      />
      <FormKit
        v-model="formState.spec.options"
        type="repeater"
        label="投票选项"
        name="options"
        :min="2"
        :max="formState.spec.type === 'single' || formState.spec.type === 'multiple' ? 99 : 2"
        :addButton="voteCount ==  0"
        :upControl="voteCount ==  0"
        :downControl="voteCount ==  0"
        :insertControl="voteCount ==  0"
        :removeControl="voteCount ==  0"
      >
        <FormKit
          type="text"
          name="title"
          label="标题"
          :disabled="voteCount > 0"
          validation="required"
        ></FormKit>
      </FormKit>
      <FormKit
        v-model="formState.spec.canAnonymously"
        name="canAnonymously"
        label="可以匿名投票"
        type="checkbox"
        validation="required"
      ></FormKit>
      <FormKit
        v-model="formState.spec.canSeeVoters"
        name="canSeeVoters"
        label="可以看到选择用户"
        type="checkbox"
        validation="required"
      ></FormKit>
      <FormKit
        v-model="formState.spec.timeLimit"
        :options="[
            { label: '1天', value: 'one' },
            { label: '7天', value: 'seven' },
            { label: '30天', value: 'thirty' },
            { label: '永久', value: 'permanent' },
            { label: '自定义', value: 'custom' }
        ]"
        label="投票有效期"
        type="radio"
        name="timeLimit"
      ></FormKit>
      <template v-if="formState.spec.timeLimit == 'custom'" >
        <FormKit
          v-model="formState.spec.startDate"
          name="startDate"
          label="开始时间"
          type="datetime-local"
          validation="required"
        />
        <FormKit
          v-model="formState.spec.endDate"
          name="endDate"
          label="结束时间"
          type="datetime-local"
          validation="required"
        />
      </template>
    </FormKit>
    <template #footer>
      <div class="flex justify-between">
        <VSpace>
          <SubmitButton
            :loading="saving"
            :disabled="saving"
            type="secondary"
            :text="'提交'"
            @submit="handleSubmit"
          >
          </SubmitButton>
        </VSpace>
        <VButton @click="modal?.close()">
          关闭
        </VButton>
      </div>
    </template>
  </VModal>
</template>
