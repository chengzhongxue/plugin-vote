<script lang="ts" setup>
import type {NodeViewProps} from "@halo-dev/richtext-editor";
import { NodeViewWrapper } from "@halo-dev/richtext-editor";
import {computed, ref} from "vue";
import {
  VButton,
  VEmpty
} from "@halo-dev/components";
import VoteListModal from "@/editor/VoteListModal.vue";
import VoteRender from "@/editor/VoteRender.vue";

const props = defineProps<NodeViewProps>();

const id = computed( () => {
  return props.node?.attrs.id || "";
});

const resetSelect = (id:string) => {
  props.updateAttributes({id: id});
};

const voteModal = ref(false);

</script>

<template>
  <node-view-wrapper 
    as="div"
    :class="[
      ':uno: rounded overflow-hidden mt-3',
      selected ? ':uno: ring-2' : ':uno: ring-1 ring-gray-200'
    ]">
    <div class=":uno: border-b border-[#e7e7e7] flex p-2.5 items-center">
      <div class=":uno: flex-1 flex items-center gap-2.5 text-sm">
        <div>投票</div>
      </div>
      <div class=":uno: flex justify-end">
        <VButton
          v-if="id"
          size="sm"
          @click="voteModal = true"
        >
          更换
        </VButton>
      </div>
    </div>
    <div class=":uno: p-2.5" >
      <VoteRender
        v-if="id"
        :id="id"
        :key="id"
      />
      <VEmpty message="当前未选择投票，点击下方按钮选择" title="未选择投票"
              v-else>
        <template #actions>
          <VButton type="secondary" @click="voteModal = true">选择</VButton>
        </template>
      </VEmpty>
    </div>
    <VoteListModal
      v-if="voteModal"
      @close="voteModal = false"
      @select="resetSelect"
    />
  </node-view-wrapper>
</template>


