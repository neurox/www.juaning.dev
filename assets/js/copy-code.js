document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.highlight').forEach((highlight) => {
        // Prevent adding multiple buttons if script runs twice
        if (highlight.querySelector('.copy-button')) return;

        // Create the button container
        const button = document.createElement('button');
        button.className = 'copy-button absolute top-3 right-3 text-slate-500 hover:text-slate-300 transition-colors p-2 rounded-md hover:bg-slate-800/50 focus:outline-none flex items-center justify-center';
        button.setAttribute('aria-label', 'Copy code to clipboard');
        button.title = 'Copy code';

        // Set inside icon using Material Symbols
        const iconInfo = document.createElement('span');
        iconInfo.className = 'material-symbols-outlined text-lg pointer-events-none';
        iconInfo.textContent = 'content_copy';
        button.appendChild(iconInfo);

        highlight.appendChild(button);

        button.addEventListener('click', async () => {
            const codeBlock = highlight.querySelector('code');
            if (!codeBlock) return;

            // Extract text content directly from the DOM node
            const textToCopy = codeBlock.innerText || codeBlock.textContent;

            try {
                await navigator.clipboard.writeText(textToCopy);
                
                // Visual feedback
                iconInfo.textContent = 'check';
                iconInfo.classList.remove('text-slate-500');
                iconInfo.classList.add('text-green-500');

                setTimeout(() => {
                    iconInfo.textContent = 'content_copy';
                    iconInfo.classList.add('text-slate-500');
                    iconInfo.classList.remove('text-green-500');
                }, 2000);
            } catch (err) {
                console.error('Failed to copy text: ', err);
                iconInfo.textContent = 'error';
                iconInfo.classList.add('text-red-500');
            }
        });
    });
});