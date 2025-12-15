<script lang="ts" setup>
import {useRoute} from "vue-router";
import {useQuery} from "@tanstack/vue-query";
import {computed, ref, watch} from "vue";
import {voteApiClient, voteUcApiClient} from "@/api";
import {
  VPageHeader,
  VSpace,
  VButton,
  VCard,
  VLoading,
  VEmpty
} from "@halo-dev/components";

const route = useRoute();

// Fetch vote details
const { data: voteDetail, isLoading: isLoadingDetail } = useQuery({
  queryKey: ["vote-detail", route.params.name],
  queryFn: async () => {
    const { data } = await voteApiClient.common.getVoteDetail(
      {
        name: route.params.name as string
      }
    )
    return data;
  },
  refetchOnWindowFocus: false,
  enabled: computed(() => !!route.params.name),
});

// Fetch user list only if allowed and voteDetail is loaded
const { data: voteUserList, isLoading: isLoadingUsers } = useQuery({
  queryKey: ["vote-user-list", route.params.name],
  queryFn: async () => {
    const { data } = route.name == 'VoteDetail' ?
      await voteApiClient.vote.voteUserList(
      {
        name: route.params.name as string
      }) :
      await voteUcApiClient.vote.getMyVoteUserList(
        {
          name: route.params.name as string
        });
    return data;
  },
  refetchOnWindowFocus: false,
  enabled: computed(() => !!route.params.name && voteDetail.value?.vote?.spec?.canSeeVoters),
});

// --- Chart Logic (Horizontal Bars) --- 
const chartContainerRef = ref<HTMLElement | null>(null);

const renderChart = () => {
  const container = chartContainerRef.value;
  const detail = voteDetail.value;
  
  if (!container || !detail?.voteDataList || !detail.vote.spec.options) return;
  
  container.innerHTML = ''; // Clear previous chart
  
  const chartWrapper = document.createElement('div');
  chartWrapper.className = 'space-y-3 mt-2 mb-6'; // Use space-y for vertical spacing
  
  const voteDataMap = new Map(detail.voteDataList.map(item => [item.id, item.voteCount]));
  const totalVotes = detail.voteCount > 0 ? detail.voteCount : 1; // Use total votes for percentage, avoid division by zero

  // Sort options by vote count descending
  const sortedOptions = [...detail.vote.spec.options].sort((a, b) => {
      const countA = voteDataMap.get(a.id ? a.id : '0') || 0;
      const countB = voteDataMap.get(b.id ? b.id : '0') || 0;
      return countB - countA;
  });
  
  sortedOptions.forEach(option => {
    const voteCount = Number(voteDataMap.get(option.id ? option.id : '0') || 0); // Fix: Explicitly convert to number
    const percentage = totalVotes === 0 ? 0 : Math.round((voteCount / totalVotes) * 100);
    
    const barContainer = document.createElement('div');
    barContainer.className = 'text-sm';

    const infoRow = document.createElement('div');
    infoRow.className = 'flex justify-between items-center mb-1';

    const titleSpan = document.createElement('span');
    titleSpan.className = 'text-gray-700';
    titleSpan.textContent = option.title;

    const countSpan = document.createElement('span');
    countSpan.className = 'text-gray-600 font-medium';
    countSpan.textContent = `${voteCount}票 (${percentage}%)`;

    infoRow.appendChild(titleSpan);
    infoRow.appendChild(countSpan);

    const progressBarWrapper = document.createElement('div');
    progressBarWrapper.className = 'w-full bg-gray-200 rounded-full h-2 overflow-hidden'; // Background bar

    const progressBar = document.createElement('div');
    progressBar.className = 'bg-blue-500 h-2 rounded-full transition-all duration-500'; // Progress bar
    progressBar.style.width = `${percentage}%`;

    progressBarWrapper.appendChild(progressBar);

    barContainer.appendChild(infoRow);
    barContainer.appendChild(progressBarWrapper);
    chartWrapper.appendChild(barContainer);
  });
  
  container.appendChild(chartWrapper);
};

// Re-render chart when voteDetail changes
watch(voteDetail, (newDetail) => {
  if (newDetail) {
    setTimeout(renderChart, 0); 
  }
}, { immediate: true, deep: true }); // Use deep watch if needed

// --- Helper Functions --- 
const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return '永久有效';
  try {
    return new Date(dateString).toLocaleString('zh-CN', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });
  } catch (e) { return dateString; }
};

const getVoteTypeText = (voteSpec: any): string => {
  if (!voteSpec) return '';
  const type = voteSpec.type;
  if (type === 'single') return '单选';
  if (type === 'pk') return '双选PK';
  if (type === 'multiple') return `多选 (最多${voteSpec.maxVotes}项)`;
  return type;
};

const getUserListForOption = (optionId: string): string[] => {
  if (!voteUserList.value) return [];
  const optionData = voteUserList.value.find(item => item.id === optionId);
  // Map user objects to their display names and filter out undefined/null
  return optionData?.userList
    ?.map(user => user.displayName)
    .filter((name): name is string => !!name) // Type guard to ensure only strings remain
    || []; 
};

const getVoteCountForOption = (optionId: string): number => {
  if (!voteDetail.value?.voteDataList) return 0;
  const optionData = voteDetail.value.voteDataList.find(data => data.id === optionId);
  return optionData?.voteCount || 0;
};

const canSeeVotersComputed = computed(() => voteDetail.value?.vote?.spec?.canSeeVoters);

</script>

<template>
  <div> <!-- Root element -->
    <VPageHeader :title="voteDetail?.vote.spec.title || '投票详情'">
      <template #actions>
        <VSpace>
          <VButton size="sm" type="default" @click="$router.back()">返回</VButton>
        </VSpace>
      </template>
    </VPageHeader>

    <div class=":uno: m-0 md:m-4">
      <VCard :body-class="[':uno: !p-2 md:!p-4']">
        <VLoading v-if="isLoadingDetail" description="加载中..." />
        
        <template v-else-if="voteDetail">
          <!-- Vote Info Section -->
          <div class=":uno: mb-4 grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2 text-sm border-b border-gray-200 pb-4">
            <div class=":uno: flex items-center gap-2 text-gray-600">
              <span class=":uno: i-carbon-category w-4 h-4 flex-shrink-0"></span>
              <span>类型:</span>
              <span class=":uno: text-gray-800 font-medium">{{ getVoteTypeText(voteDetail.vote.spec) }}</span>
            </div>
            <div class=":uno: flex items-center gap-2 text-gray-600">
              <span class=":uno: i-carbon-category w-4 h-4 flex-shrink-0"></span>
              <span>匿名投票:</span>
              <span class=":uno: text-gray-800 font-medium">{{ voteDetail.vote.spec.canAnonymously ? '允许' : '不允许' }}</span>
            </div>
            <div class=":uno: flex items-center gap-2 text-gray-600">
              <span class=":uno: i-carbon-user-multiple w-4 h-4 flex-shrink-0"></span>
              <span>参与人数:</span>
              <span class=":uno: text-gray-800 font-medium">{{ voteDetail.voteUser ?? 0 }}人</span>
            </div>
            <div class=":uno: flex items-center gap-2 text-gray-600">
              <span class=":uno: i-carbon-timer w-4 h-4 flex-shrink-0"></span>
              <span>{{ voteDetail.vote.spec.hasEnded ? '状态:' : '截止:' }}</span>
              <span :class="[':uno: text-gray-800 font-medium', voteDetail.vote.spec.hasEnded ? 'text-red-600' : '']">
                {{ voteDetail.vote.spec.hasEnded ? '已结束' : formatDate(voteDetail.vote.spec.endDate) }}
              </span>
            </div>
            <div class=":uno: flex items-center gap-2 text-gray-600">
              <span class=":uno: i-carbon-timer w-4 h-4 flex-shrink-0"></span>
              <span>可看选择用户:</span>
              <span class=":uno: text-gray-800 font-medium">{{ voteDetail.vote.spec.canSeeVoters  ? '允许' : '不允许' }}</span>
            </div>
            <div class=":uno: flex items-center gap-2 text-gray-600">
              <span class=":uno: i-carbon-checkbox-checked w-4 h-4 flex-shrink-0"></span>
              <span>总票数:</span>
              <span class=":uno: text-gray-800 font-medium">{{ voteDetail.voteCount ?? 0 }}票</span>
            </div>
          </div>
          
          <!-- Chart Section -->
          <div v-if="voteDetail.voteCount > 0">
            <h3 class=":uno: text-lg font-semibold text-gray-800 mb-2">投票统计</h3>
            <div ref="chartContainerRef">
              <!-- Chart rendered by script -->
            </div>
          </div>
          
          <!-- Table Section -->
          <div class=":uno: mt-6">
            <h3 class=":uno: text-lg font-semibold text-gray-800 mb-3">详细数据</h3>
            <div class=":uno: overflow-x-auto border border-gray-200 rounded-md">
              <table class=":uno: w-full min-w-[400px] text-sm text-left">
                <colgroup>
                  <col class=":uno: sm:w-1/10">
                  <col class=":uno: sm:w-1/10">
                  <col class=":uno: w-full sm:w-1/1.25">
                </colgroup>
                <thead class=":uno: bg-gray-50 border-b border-gray-200 text-xs text-gray-700 uppercase">
                  <tr>
                    <th scope="col" class=":uno: px-4 py-2">选项</th>
                    <th scope="col" class=":uno: px-4 py-2">票数</th>
                    <th scope="col" class=":uno: px-4 py-2">投票人 {{ canSeeVotersComputed ? '(仅登录用户)' : ''}}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="!voteDetail.vote.spec.options || voteDetail.vote.spec.options.length === 0">
                    <td :colspan="3" class=":uno: text-center text-gray-500 px-4 py-4">
                      没有投票选项。
                    </td>
                  </tr>
                  <tr v-for="(option, index) in voteDetail.vote.spec.options" 
                      :key="option.id" 
                      :class="[':uno: border-b border-gray-200', index % 2 === 0 ? ':uno: bg-white' : ':uno: bg-gray-50/50']">
                    <td class=":uno: px-4 py-2 font-medium text-gray-900 whitespace-nowrap">{{ option.title }}</td>
                    <td class=":uno: px-4 py-2 font-medium">{{ getVoteCountForOption(option.id ? option.id : '0') }}</td>
                    <td class="':uno: px-4 py-2'">
                      <span v-if="isLoadingUsers" class=":uno: text-gray-500">加载中...</span>
                      <div v-else-if="getUserListForOption(option.id ? option.id : '0').length > 0" class=":uno: flex flex-wrap gap-1">
                          <span v-for="(displayName, index) in getUserListForOption(option.id ? option.id : '0')"
                                :key="index"
                                class=":uno: bg-gray-100 text-gray-700 text-xs font-medium px-2 py-0.5 rounded-full border border-gray-200">
                            {{ displayName }}
                          </span>
                      </div>
                      <span v-else class=":uno: text-gray-400">-</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </template>
        
        <VEmpty 
          v-else-if="!isLoadingDetail && !voteDetail"
          title="无法加载投票数据"
          description="请检查投票名称是否正确或稍后再试。"
          class=":uno: py-10"
        />
      </VCard>
    </div>
  </div>
</template>
