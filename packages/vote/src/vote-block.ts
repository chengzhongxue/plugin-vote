import resetStyles from '@unocss/reset/tailwind.css?inline';
import { LitElement, css, html, unsafeCSS } from 'lit';
import { property, state } from 'lit/decorators.js';
import './loading-bar';
import { ToastManager } from './lit-toast';
import './vote-user-modal';
import { VoteUserModal } from './vote-user-modal';

export class VoteBlock extends LitElement {

  @property({ type: String , attribute: 'id' })
  name = '';

  @state()
  loading = false;

  @state()
  submitting = false;

  @state()
  voteDetail: VoteDetail | null = null;

  @state()
  error: string | null = null;

  @state()
  selectedOptions: Set<string> = new Set();

  @state()
  toastManager = new ToastManager();



  override connectedCallback() {
    super.connectedCallback();
    if (this.name) {
      this.fetchVoteDetail();
    }
  }

  handleOpenVoteUserModal() {
    const container = document.body.querySelector('vote-user-modal');

    if (!container) {
      const voteUserModal = new VoteUserModal();
      voteUserModal.open = true;
      voteUserModal.voteName = this.name;
      voteUserModal.options = this.voteDetail?.vote.spec.options || [];
      document.body.appendChild(voteUserModal);
    } else {
      (container as VoteUserModal).open = true;
    }
  }

  async fetchVoteDetail() {
    try {
      this.loading = true;
      const response = await fetch(
        `/apis/api.vote.kunkunyu.com/v1alpha1/votes/${this.name}/detail`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch vote data');
      }

      this.voteDetail = await response.json() as VoteDetail;
      
      // 如果用户已经投票，将已选选项加入到selectedOptions中
      if (this.voteDetail.userVoteData && this.voteDetail.userVoteData.length > 0) {
        this.selectedOptions = new Set(this.voteDetail.userVoteData);
      }
    } catch (error) {
      console.error(error);
      this.error = 'Failed to load vote data';
    } finally {
      this.loading = false;
    }
  }

  // 处理选项点击
  handleOptionClick(optionId: string) {
    if (!this.voteDetail || this.hasVoted() || this.voteDetail.vote.spec.hasEnded) {
      // 如果已经投票或投票已结束，显示提示信息
      this.toastManager.warn('您已经投票或投票已结束');
      return;
    }

    const voteType = this.voteDetail.vote.spec.type;
    const maxVotes = this.voteDetail.vote.spec.maxVotes || 1;

    if (voteType === 'single' || voteType === 'pk') {
      // 单选，清除已选
      this.selectedOptions.clear();
      this.selectedOptions.add(optionId);
    } else if (voteType === 'multiple') {
      // 多选
      if (this.selectedOptions.has(optionId)) {
        // 如果已选中，则取消选中
        this.selectedOptions.delete(optionId);
      } else {
        // 检查是否超过最大选择数
        if (this.selectedOptions.size >= maxVotes) {
          this.toastManager.warn(`最多只能选择${maxVotes}项`);
          return;
        }
        // 添加选中
        this.selectedOptions.add(optionId);
      }
    }
    
    // 触发重新渲染
    this.requestUpdate();
  }

  // 提交投票
  async submitVote() {
    if (!this.voteDetail) return;
    
    // 检查是否已经投票
    if (this.hasVoted()) {
      this.toastManager.warn('您已经完成投票，请勿重复提交');
      return;
    }
    
    // 检查是否选择了选项
    if (this.selectedOptions.size === 0) {
      this.toastManager.warn('请至少选择一个选项');
      return;
    }

    try {
      this.submitting = true;
      const response = await fetch(
        `/apis/api.vote.kunkunyu.com/v1alpha1/votes/${this.name}/submit`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            voteData: Array.from(this.selectedOptions),
          }),
        }
      );

      if (!response.ok) {
        const { detail } = await response.json();
          this.toastManager.error(detail);
          return;
      }

      // 投票成功
      this.toastManager.success('投票成功');
      
      // 刷新投票数据
      await this.fetchVoteDetail();
    } catch (error) {
        if (error instanceof Error) {
            this.toastManager.error(error.message);
        }
    } finally {
      this.submitting = false;
    }
  }

  // 检查是否已经投票
  hasVoted(): boolean {
    return !!(this.voteDetail && this.voteDetail.userVoteData && this.voteDetail.userVoteData.length > 0);
  }

  // 计算每个选项的投票百分比
  calculatePercentage(voteCount: number): string {
    if (!this.voteDetail || this.voteDetail.voteCount === 0) {
      return '0';
    }
    return Math.round((voteCount / this.voteDetail.voteCount) * 100).toString();
  }

  // 检查用户是否已选择该选项
  isOptionSelected(optionId: string): boolean {
    // 如果已投票，则根据voteDetail.userVoteData判断
    if (this.hasVoted()) {
      return this.voteDetail!.userVoteData.includes(optionId);
    }
    // 否则根据临时选择状态判断
    return this.selectedOptions.has(optionId);
  }

  // 获取投票类型显示文本
  getVoteTypeText(): string {
    if (!this.voteDetail) return '';
    
    const type = this.voteDetail.vote.spec.type;
    if (type === 'single') {
      return '单选';
    } else if (type === 'pk') {
      return `双选PK`;
    } else if (type === 'multiple') {
      return `多选(最多${this.voteDetail.vote.spec.maxVotes}项)`;
    }
    return type;
  }

  // 获取投票有效期显示文本
  getTimeLimitText(): string {
  
    if (!this.voteDetail) return '';

    if(this.voteDetail.vote.spec.hasEnded) {
      return '已结束';
    }
    
    if (!this.voteDetail.vote.spec.endDate) {
      return '长期有效';
    } else {
      // 格式化时间戳为可读格式
      try {
        const endDate = new Date(this.voteDetail.vote.spec.endDate);
        const year = endDate.getFullYear();
        const month = String(endDate.getMonth() + 1).padStart(2, '0');
        const day = String(endDate.getDate()).padStart(2, '0');
        const hours = String(endDate.getHours()).padStart(2, '0');
        const minutes = String(endDate.getMinutes()).padStart(2, '0');
        
        return `${year}-${month}-${day} ${hours}:${minutes} 结束`;
      } catch (e) {
        // 如果解析失败，返回原始时间戳
        return this.voteDetail.vote.spec.endDate + ' 结束';
      }
    }
  }

  // Renders the submit button and footer section
  private _renderSubmitAndFooter(hasVoted: boolean, isEnded: boolean, voteUser: number) {
    return html`
      ${!hasVoted && !isEnded && this.selectedOptions.size > 0 ?
        html`
          <div class="flex justify-center mt-4">
            <button
              class="bg-button ${this.submitting || this.selectedOptions.size === 0 ? 'opacity-50 cursor-not-allowed' : 'bg-button-hover'} text-button py-2 px-6 rounded-full shadow transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              ?disabled=${this.submitting || this.selectedOptions.size === 0}
              @click=${this.submitVote}
            >
              ${this.submitting ? '提交中...' : '提交投票'}
            </button>
          </div>
        ` :
        html``
      }
      <div class="mt-6 pt-4 border-t border-default flex justify-between items-center">
        <div class="flex flex-wrap gap-2 text-sm">
          <span class="bg-tag px-2 py-1 rounded-full text-description">${this.getVoteTypeText()}</span>
          <span class="bg-tag px-2 py-1 rounded-full text-description">${this.getTimeLimitText()}</span>
        </div>
        <div class="flex flex-wrap gap-2 text-sm">
          <span class="bg-tag px-2 py-1 rounded-full text-description">${voteUser}人已参与</span>
          ${hasVoted ?
            html`<span class="bg-voted-tag text-voted px-2 py-1 rounded-full">您已完成投票</span>` :
            (isEnded ? html`<span class="bg-tag px-2 py-1 rounded-full text-description">投票已结束</span>` : '')}
        </div>
      </div>
    `;
  }

  override render() {
    if (this.loading) {
      return html`<loading-bar></loading-bar>`;
    }

    if (this.error) {
      return html`<div class="p-4 text-error">${this.error}</div>`;
    }

    if (!this.voteDetail) {
      return html`<div class="p-4 text-description">No vote data available for ID: ${this.name}</div>`;
    }

    const { vote, voteDataList, voteUser } = this.voteDetail;
    const { spec } = vote;
    const hasVoted = this.hasVoted();
    const isEnded = spec.hasEnded;
    const canSeeVoters = spec.canSeeVoters;

    // PK Type Specific Rendering
    if (spec.type === 'pk' && spec.options.length === 2) {
      const option1 = spec.options[0];
      const option2 = spec.options[1];
      const voteData1 = voteDataList.find((data) => data.id === option1.id);
      const voteData2 = voteDataList.find((data) => data.id === option2.id);
      const voteCount1 = voteData1 ? voteData1.voteCount : 0;
      const voteCount2 = voteData2 ? voteData2.voteCount : 0;
      const totalVotes = voteCount1 + voteCount2; // Use sum of the two options for PK percentage
      // Avoid division by zero and ensure percentages sum to 100
      const percentage1 = totalVotes === 0 ? 50 : Math.round((voteCount1 / totalVotes) * 100);
      const percentage2 = 100 - percentage1; // Ensure sum is exactly 100

      const isSelected1 = this.isOptionSelected(option1.id);
      const isSelected2 = this.isOptionSelected(option2.id);

      const isUserVoted1 = hasVoted && this.voteDetail!.userVoteData.includes(option1.id);
      const isUserVoted2 = hasVoted && this.voteDetail!.userVoteData.includes(option2.id);

      // Determine styles based on selection/voted status
      // Use specific colors for PK, maybe define CSS vars later if needed
      const segment1Bg = isUserVoted1 ? 'bg-voted' : (isSelected1 && !hasVoted ? 'bg-selected' : 'pk-option1-bg'); 
      const segment2Bg = isUserVoted2 ? 'bg-voted' : (isSelected2 && !hasVoted ? 'bg-selected' : 'pk-option2-bg'); 
      const text1Color = isUserVoted1 || (isSelected1 && !hasVoted) ? 'text-voted' : 'pk-progress-text'; // Use variable for PK progress text
      const text2Color = isUserVoted2 || (isSelected2 && !hasVoted) ? 'text-voted' : 'pk-progress-text';
      
      const label1Color = isUserVoted1 ? 'text-voted font-medium' : (isSelected1 && !hasVoted ? 'text-selected font-medium' : 'text-description');
      const label2Color = isUserVoted2 ? 'text-voted font-medium' : (isSelected2 && !hasVoted ? 'text-selected font-medium' : 'text-description');

      // Calculate minimum width for each segment to ensure visibility even at 0%
      const minWidth = '1.5rem'; // Smaller minimum width for near-zero options
      
      // When one option dominates, make the other option very small
      const isDominant = percentage1 >= 98 || percentage2 >= 98;
      
      // Use special styling for dominant cases
      const width1Style = isDominant ? 
        (percentage1 >= 98 ? '100%' : minWidth) : 
        (percentage1 <= 2 ? minWidth : 'auto');
      
      const width2Style = isDominant ? 
        (percentage2 >= 98 ? '100%' : minWidth) : 
        (percentage2 <= 2 ? minWidth : 'auto');
      
      // For flex-grow, use actual percentages but ensure minimal representation
      const flexGrow1 = Math.max(percentage1, percentage1 <= 2 ? 0 : 1);
      const flexGrow2 = Math.max(percentage2, percentage2 <= 2 ? 0 : 1);

      return html`
        <div class="items-center justify-center">
          <div class="w-full bg-primary rounded-xl p-6 vote-shadow-default">
            <div class="flex items-center gap-2 mb-4">
              <h1 class="text-xl font-medium text-title">${spec.title}</h1>
              <div class="flex items-center gap-2 ml-auto">
                 ${canSeeVoters ? 
                  html`
                    <svg class="w-6 h-6 text-icon cursor-pointer" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" 
                        @click=${this.handleOpenVoteUserModal}>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                    </svg>
                  ` : 
                  html``
                }
              </div>
            </div>
            
            <!-- PK Progress Bar with min-width -->
            <div class="mb-2 flex w-full h-10 rounded-full overflow-hidden ${hasVoted || isEnded ? 'cursor-default pointer-events-none' : ''}">
              <div 
                class="flex items-center justify-center ${segment1Bg} ${hasVoted || isEnded ? '' : 'cursor-pointer hover:opacity-90'} transition-all duration-500 ease-in-out" 
                style="flex-grow: ${flexGrow1}; min-width: ${percentage1 <= 2 ? minWidth : '0'}; ${width1Style !== 'auto' ? `width: ${width1Style};` : ''}" 
                @click=${() => this.handleOptionClick(option1.id)}
              >
                <span class="text-sm ${text1Color} ${percentage1 <= 5 ? 'opacity-0' : ''}">${percentage1}%</span>
              </div>
              <div 
                class="flex items-center justify-center ${segment2Bg} ${hasVoted || isEnded ? '' : 'cursor-pointer hover:opacity-90'} transition-all duration-500 ease-in-out" 
                style="flex-grow: ${flexGrow2}; min-width: ${percentage2 <= 2 ? minWidth : '0'}; ${width2Style !== 'auto' ? `width: ${width2Style};` : ''}" 
                @click=${() => this.handleOptionClick(option2.id)}
              >
                <span class="text-sm ${text2Color} ${percentage2 <= 5 ? 'opacity-0' : ''}">${percentage2}%</span>
              </div>
            </div>

            <!-- PK Labels -->
            <div class="flex justify-between px-2 mb-4">
              <span 
                class="text-sm ${label1Color} ${hasVoted || isEnded ? 'cursor-default pointer-events-none' : 'cursor-pointer'}" 
                @click=${() => this.handleOptionClick(option1.id)}
              >
                ${option1.title}
              </span>
              <span 
                class="text-sm ${label2Color} ${hasVoted || isEnded ? 'cursor-default pointer-events-none' : 'cursor-pointer'}" 
                @click=${() => this.handleOptionClick(option2.id)}
              >
                ${option2.title}
              </span>
            </div>

            <!-- Submit Button & Footer -->
            ${this._renderSubmitAndFooter(hasVoted, isEnded, voteUser)}
            
          </div>
        </div>
      `;
    }

    // Default Rendering for 'single' and 'multiple'
    return html`
      <div class="items-center justify-center">
        <div class="w-full bg-primary rounded-xl p-6 vote-shadow-default">
          <div class="flex items-center gap-2 mb-4">
            <h1 class="text-xl font-medium text-title">${spec.title}</h1>
            <div class="flex items-center gap-2 ml-auto">
              ${canSeeVoters ? 
                html`
                  <svg class="w-6 h-6 text-icon cursor-pointer" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" 
                      @click=${this.handleOpenVoteUserModal}>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                  </svg>
                ` : 
                html``
              }
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            ${spec.options.map((option) => {
              const voteData = voteDataList.find((data) => data.id === option.id);
              const voteCount = voteData ? voteData.voteCount : 0;
              const percentage = this.calculatePercentage(voteCount);
              const isSelected = this.isOptionSelected(option.id);
              const isUserVoted = this.hasVoted() && this.voteDetail!.userVoteData.includes(option.id);
              
              // Determine the appropriate styles based on voting state
              const optionBgClass = isUserVoted ? 'bg-voted' : (isSelected && !hasVoted ? 'bg-selected' : 'bg-secondary');
              const optionBorderClass = isUserVoted ? 'border-voted' : (isSelected && !hasVoted ? 'border-selected' : 'border-transparent'); // Use transparent border for default
              const optionTextClass = isUserVoted ? 'text-voted' : (isSelected && !hasVoted ? 'text-selected' : '');
              const progressBgClass = isUserVoted ? 'bg-progress-voted' : 'bg-progress';
              const checkmarkIcon = isUserVoted ? html`<span class="text-voted i-carbon-checkmark-filled block w-4 h-4"></span>` : (isSelected && !hasVoted ? html`<span class="text-selected i-carbon-checkbox-checked block w-4 h-4"></span>` : '');
              
              return html`
                <div 
                  class="vote-option relative ${optionBgClass} border ${optionBorderClass} p-4 rounded-lg ${hasVoted || isEnded ? 'cursor-default pointer-events-none' : 'cursor-pointer hover:bg-tertiary'} transition-all"
                  @click=${() => this.handleOptionClick(option.id)}
                >
                  <div class="flex justify-between items-center">
                    <div class="z-10 relative flex items-center gap-2">
                      ${checkmarkIcon}
                      <span class="${optionTextClass} font-medium">${option.title}</span>
                    </div>
                    <span class="text-description font-medium">${percentage}%</span>
                  </div>
                  <div class="absolute left-0 top-0 h-full ${progressBgClass} rounded-lg progress-bar" style="width: ${percentage}%"></div>
                </div>
              `;
            })}
          </div>
            
            <!-- Submit Button & Footer -->
            ${this._renderSubmitAndFooter(hasVoted, isEnded, voteUser)}
            
        </div>
      </div>
    `;
  }

  static override styles = [
    unsafeCSS(resetStyles),
    css`
      :host {
        display: inline-block;
        width: 100%;
      }
      .vote-option {
        transition: all 0.3s ease;
      }
      .progress-bar {
        transition: width 0.5s ease-in-out;
      }
      .vote-shadow-default {
        box-shadow: var(--vote-shadow, 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1));
      }
      @unocss-placeholder;
    `,
  ];
}

customElements.get('vote-block') || customElements.define('vote-block', VoteBlock);

declare global {
  interface HTMLElementTagNameMap {
    'vote-block': VoteBlock;
  }
}
