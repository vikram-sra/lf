/**
 * Lady Friend - Toast Notification System
 */

const ToastManager = (() => {
    let container = null;

    function getContainer() {
        if (!container) {
            container = document.getElementById('toast-container');
            if (!container) {
                container = document.createElement('div');
                container.id = 'toast-container';
                document.body.appendChild(container);
            }
        }
        return container;
    }

    function show(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');

        const icons = { success: '✦', error: '✗', info: '✧' };
        toast.innerHTML = `<span class="toast-icon">${icons[type] || '✧'}</span><span class="toast-msg">${message}</span>`;

        getContainer().appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.add('toast-visible');
        });

        setTimeout(() => {
            toast.classList.remove('toast-visible');
            toast.classList.add('toast-exit');
            setTimeout(() => toast.remove(), 340);
        }, duration);
    }

    return { show };
})();

function showToast(message, type = 'info', duration = 3000) {
    ToastManager.show(message, type, duration);
}

window.showToast = showToast;
