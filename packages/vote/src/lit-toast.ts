import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import './icons/icon-loading';
import { classMap } from 'lit/directives/class-map.js';

type ToastType = 'success' | 'error' | 'warn';

export class VoteToast extends LitElement {
  @property({ type: String })
  message = '';

  @property({ type: String })
  type = 'success' as ToastType;

  override render() {
    return html`<div
      class="toast ${classMap({
        'toast--error': this.type === 'error',
        'toast--success': this.type === 'success',
        'toast--warn': this.type === 'warn',
      })}"
    >
      ${this.type === 'success'
        ? html`<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
            <g
              fill="none"
              stroke="#fff"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            >
              <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0" />
              <path d="m9 12l2 2l4-4" />
            </g>
          </svg>`
        : html`<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
            <path
              fill="none"
              stroke="#fff"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0m9-3v4m0 3v.01"
            />
          </svg>`} <span>${this.message}</span>
    </div>`;
  }

  static override styles = [
    css`
      .toast {
        border-radius: 0.4rem;
        font-size: 0.875em;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.5em 0.625em;
        justify-content: space-between;
        overflow: hidden;
        color: #fff;
        gap: 0.5em;
        box-shadow:
          0 0 #0000,
          0 0 #0000,
          0 1px 3px 0 rgb(0 0 0 / 0.1),
          0 1px 2px -1px rgb(0 0 0 / 0.1);

        animation: slideInDown 0.3s ease-out forwards;
      }

      .toast--exit {
        animation: slideOutUp 0.3s ease-in forwards;
      }

      .toast--error {
        background-color: #d71d1d;
      }

      .toast--success {
        background-color: #4ccba0;
      }

      .toast--warn {
        background-color: #f5a623;
      }

      @keyframes slideInDown {
        from {
          transform: translateY(0);
          opacity: 0;
        }
        to {
          transform: translateY(100%);
          opacity: 1;
        }
      }

      @keyframes slideOutUp {
        from {
          transform: translateY(100%);
          opacity: 1;
        }
        to {
          transform: translateY(0);
          opacity: 0;
        }
      }
    `,
  ];
}

export class VoteToastContainer extends LitElement {
  override render() {
    return html`<slot></slot>`;
  }

  static override styles = [
    css`
      :host {
        position: fixed;
        top: 1em;
        z-index: 1000;
        display: flex;
        width: 100%;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 0.5em;
      }
    `,
  ];
}

customElements.get('vote-toast') || customElements.define('vote-toast', VoteToast);
customElements.get('vote-toast-container') ||
  customElements.define('vote-toast-container', VoteToastContainer);

declare global {
  interface HTMLElementTagNameMap {
    'vote-toast': VoteToast;
    'vote-toast-container': VoteToastContainer;
  }
}

export class ToastManager {
  private body: HTMLBodyElement = document.body as HTMLBodyElement;
  private toastContainer: VoteToastContainer;

  constructor() {
    const container = this.body.querySelector('vote-toast-container');

    if (!container) {
      this.toastContainer = new VoteToastContainer();
      this.body.appendChild(this.toastContainer);
    } else {
      this.toastContainer = container as VoteToastContainer;
    }
  }

  show(message: string, type: ToastType) {
    const toast = new VoteToast();
    toast.message = message;
    toast.type = type;
    this.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast--exit');
      setTimeout(() => {
        this.toastContainer?.removeChild(toast);
      }, 300);
    }, 3000);
  }

  success(message: string) {
    this.show(message, 'success');
  }

  error(message: string) {
    this.show(message, 'error');
  }

  warn(message: string) {
    this.show(message, 'warn');
  }
}
