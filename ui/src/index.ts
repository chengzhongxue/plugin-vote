import { definePlugin } from "@halo-dev/ui-shared";
import { markRaw } from "vue";
import FluentVote20Regular from '~icons/fluent/vote-20-regular?width=1.2em&height=1.2em';
import '@kunkunyu/vote';
import {VoteBlockExtension} from "@/editor";
import VoteDetail from "@/views/VoteDetail.vue";
import UcVotes from "@/uc/UcVotes.vue";
import "uno.css";

export default definePlugin({
  components: {},
  routes: [
    {
      parentName: "ToolsRoot",
      route: {
        path: "/vote",
        children: [
          {
            path: "",
            name: "Vote",
            component: () => import("@/views/Votes.vue"),
            meta: {
              title: "投票管理",
              searchable: true,
              permissions: ["plugin:vote:view"],
              menu: {
                name: "投票管理",
                icon: markRaw(FluentVote20Regular),
                priority: 0,
              }
            }
          },
          {
            path: ":name/detail",
            name: "VoteDetail",
            component: () => import("@/views/VoteDetail.vue"),
            meta: {
              title: "投票统计详情",
              searchable: true,
              permissions: ["plugin:vote:view"],
            }
          }
        ]
      }
    },
  ],
  ucRoutes:[{
    parentName: "Root",
    route: {
      path: "/vote",
      meta: {
        permissions: ["uc:plugin:vote:manage"]
      },
      children: [{
        path: "",
        name: "UcVote",
        component: UcVotes,
        meta: {
          title: "我的投票管理",
          searchable: true,
          menu: {
            name: "我的投票管理",
            group: "工具",
            icon: markRaw(FluentVote20Regular),
            priority: 0
          }
        }
      }, {
        path: ":name/detail",
        name: "UcVoteDetail",
        component: VoteDetail,
        meta: {
          title: "投票统计详情",
          searchable: true,
        }
      }]
    }
  }],
  extensionPoints: {
    "default:editor:extension:create": () => {
      return [VoteBlockExtension];
    },
  },
});
