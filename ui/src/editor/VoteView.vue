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
    :class="['vote-container',{'vote-container--selected': selected}]">
    <div class="vote-nav">
      <div class="vote-nav-start">
        <div>投票</div>
      </div>
      <div class="vote-nav-end">
        <VButton
          v-if="id"
          size="sm"
          @click="voteModal = true"
        >
          更换
        </VButton>
      </div>
    </div>
    <div class="vote-preview" >
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

<style>
.vote-container {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow, 0 0 #0000);
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(229 231 235 / var(--tw-ring-opacity));
  border-radius: 4px;
  overflow: hidden;
  margin-top: .75em
}

.vote-container--selected {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow, 0 0 #0000);
  --tw-ring-color: inherit
}

.vote-nav {
  border-bottom: 1px #e7e7e7 solid;
  display: flex;
  padding: 5px 10px;
  align-items: center
}

.vote-nav-start {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px
}

.vote-nav-end {
  justify-content: flex-end
}

.vote-preview {
  padding: 5px 10px
}
</style>  


