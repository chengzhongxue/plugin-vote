import resetStyles from '@unocss/reset/tailwind.css?inline';
import { LitElement, css, html, unsafeCSS } from 'lit';
import { property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { map } from 'lit/directives/map.js';

// Define interfaces for better type safety
interface VoteOption {
    id: string;
    title: string;
}

interface VoteUser {
    name: string;
    displayName: string;
}

interface UserListDataItem {
    id: string; // Corresponds to VoteOption id
    userList: VoteUser[];
}

export class VoteUserModal extends LitElement {

    @property({ type: Boolean })
    open = false;

    @property({ type: String })
    voteName = ''; // Name of the vote to fetch data for

    @property({ type: Array })
    options: VoteOption[] = []; // Vote options passed to the modal

    @state() // Use @state for internal reactive properties
    private _userListData: UserListDataItem[] = [];

    @state()
    private _isLoading = false;

    @state()
    private _error: string | null = null;

    // Fetch data when voteName changes and the modal is open
    override updated(changedProperties: Map<string | number | symbol, unknown>) {
        if (changedProperties.has('voteName') || changedProperties.has('open')) {
            if (this.voteName && this.open && !this._userListData.length) { // Fetch only if needed
                this._fetchUserListData();
            }
        }
    }

    private async _fetchUserListData() {
        this._isLoading = true;
        this._error = null;
        try {
            // Construct the API URL dynamically
            const apiUrl = `/apis/api.vote.kunkunyu.com/v1alpha1/votes/${this.voteName}/user-list`;
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this._userListData = await response.json();
        } catch (e) {
            console.error('Error fetching user list data:', e);
            this._error = e instanceof Error ? e.message : 'Failed to load data.';
        } finally {
            this._isLoading = false;
        }
    }

    private _findUsersForOption(optionId: string): VoteUser[] {
        const data = this._userListData.find(item => item.id === optionId);
        return data?.userList || [];
    }

    override render() {
        return html`
      <div class="modal__wrapper" style="${styleMap({ display: this.open ? 'flex' : 'none' })}">
        <div class="modal__layer backdrop-blur-sm bg-gray-800/40" @click="${this.close}"></div>
          <div class="fixed top-0 right-0 bottom-0 left-0 overflow-y-auto">
              <div class="min-h-full flex items-center justify-center p-4 text-center">
                  <div class="max-w-36rem w-full transform overflow-hidden rounded-lg bg-primary p-6 text-left align-middle shadow-default transition-all ease-in-out duration-150">
                      <div class="flex flex-row-reverse items-center justify-between">
                          <button type="button" tabindex="0" class="text-xl text-icon" @click="${this.close}">
                              <span class="i-carbon-close block w-1em h-1em"></span>
                          </button>
                          <h2 class="text-lg text-title font-semibold">投票数据统计</h2>
                      </div>
                      <div class="mt-6 border-default max-h-[60vh] overflow-y-auto">
                          ${this._isLoading
                              ? html`<div class="text-center text-description py-4">加载中...</div>`
                              : this._error
                                  ? html`<div class="text-center text-error py-4">加载失败: ${this._error}</div>`
                                  : html`
                                    <div class="space-y-4">
                                        ${this.options.length === 0
                                            ? html`<div class="text-center text-description">没有投票选项。</div>`
                                            : map(this.options, (option) => {
                                                const users = this._findUsersForOption(option.id);
                                                return html`
                                                    <div class="border border-default rounded-md p-3">
                                                        <h3 class="font-medium text-title mb-2">${option.title}</h3>
                                                        ${users.length > 0
                                                            ? html`
                                                                <div class="flex flex-wrap gap-1">
                                                                    ${map(users, (user) => html`
                                                                        <span class="bg-tag text-description text-xs font-medium px-2 py-0.5 rounded-full border border-default">
                                                                            ${user.displayName || user.name}
                                                                        </span>
                                                                    `)}
                                                                </div>
                                                            `
                                                            : html`<span class="text-sm text-description">-</span>`
                                                        }
                                                    </div>
                                                `;
                                            })
                                        }
                                    </div>
                                  `
                          }
                      </div>
                  </div>
              </div>
          </div>
      </div>
    `;
    }

    close() {
        this.open = false;
        // Optionally reset state when closing
        // this._userListData = [];
        // this._isLoading = false;
        // this._error = null;
    }

    static override styles = [
        unsafeCSS(resetStyles),
        css`
        :host {
            display: block;
        }
        .modal__wrapper {
            position: fixed;
            left: 0px;
            top: 0px;
            display: flex;
            height: 100%;
            width: 100%;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            padding-top: 2.5em;
            padding-bottom: 2.5em;
            z-index: 999;
        }
        .modal__layer {
            position: absolute;
            top: 0px;
            left: 0px;
            height: 100%;
            width: 100%;
            flex: none;
            animation: fadeIn 0.15s both;
        }
        .vote-shadow-default {
           box-shadow: var(--vote-shadow,0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1));
        }
        @unocss-placeholder
            `,
    ];
}
customElements.get('vote-user-modal') || customElements.define('vote-user-modal', VoteUserModal);
declare global {
    interface HTMLElementTagNameMap {
        'vote-user-modal': VoteUserModal;
    }
}
