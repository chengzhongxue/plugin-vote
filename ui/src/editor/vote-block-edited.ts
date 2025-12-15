import {
  type Editor,
  isActive,
  mergeAttributes,
  Node,
  nodeInputRule,
  type Range,
  VueNodeViewRenderer,
  type EditorState,
  nodePasteRule,
} from "@halo-dev/richtext-editor";
import VoteView from "./VoteView.vue";
import { markRaw } from "vue";
import { ToolboxItem } from "@halo-dev/richtext-editor";
import MdiDeleteForeverOutline from "~icons/mdi/delete-forever-outline?color=red";
import { deleteNode } from "../utils/delete-node";
import FluentVote20Regular from '~icons/fluent/vote-20-regular?width=1.2em&height=1.2em';

declare module "@halo-dev/richtext-editor" {
  interface Commands<ReturnType> {
    "vote-block": {
      setVoteBlock: (options: { id: string }) => ReturnType;
    };
  }
}

const VoteBlockExtension = Node.create({
  name: "vote-block",
  fakeSelection: true,

  group() {
    return "block";
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      id: {
        default: null,
        parseHTML: (element) => {
          return element.getAttribute("id");
        },
        renderHTML: (attributes) => {
          return { id: attributes.id };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "vote-block",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["vote-block", mergeAttributes(HTMLAttributes)];
  },
  
  addCommands() {
    return {
      setVoteBlock:
        (options) =>
          ({ commands }) => {
            return commands.insertContent([{
              type: this.name,
              attrs: options,
            },{
              type: "paragraph",
              content: ""
            }]);
          },
    };
  },
  
  addInputRules() {
    return [
      nodeInputRule({
        find: /vote-block$/,
        type: this.type,
        getAttributes: (e) => ({
          id: e[1]
        }),
      }),
    ];
  },
  
  addPasteRules() {
    return [
      nodePasteRule({
        find: /<vote-block\s+id="(\S+)"\s*><\/vote-block>/g,
        type: this.type,
        getAttributes: (e) => ({
          id: e[1]
        }),
      }),
    ];
  },

  addNodeView() {
    return VueNodeViewRenderer(VoteView);
  },

  addOptions() {
    return {
      getCommandMenuItems() {
        return {
          priority: 2e2,
          icon: markRaw(FluentVote20Regular),
          title: "添加投票",
          keywords: ["vote-block", "vote", "投票"],
          command: ({ editor, range }: { editor: Editor; range: Range }) => {
            editor
              .chain()
              .focus()
              .setVoteBlock({id: ""})
              .deleteRange(range)
              .run();
          },
        };
      },
      getToolboxItems({ editor }: { editor: Editor }) {
        return {
          priority: 59,
          component: markRaw(ToolboxItem),
          props: {
            editor,
            icon: markRaw(FluentVote20Regular),
            title: "添加投票",
            action: () => {
              editor
                .chain()
                .focus()
                .setVoteBlock({id: ""})
                .run();
            },
          },
        };
      },
      getBubbleMenu({ editor }: { editor: Editor }) {
        return {
          pluginKey: "vote-block-bubble-menu",
          shouldShow: ({ state }: { state: EditorState }) => {
            return isActive(state, VoteBlockExtension.name);
          },
          options: {
            placement: "top-start",
          },
          items: [
            {
              priority: 50,
              props: {
                icon: markRaw(MdiDeleteForeverOutline),
                title: "删除",
                action: ({ editor }: { editor: Editor }) => {
                  deleteNode(VoteBlockExtension.name, editor);
                },
              },
            },
          ],
        };
      },
    }
  }


})

export default VoteBlockExtension;
