import React, { useEffect } from 'react';

export const CopyToClipboard: React.FC = () => {
  const LanguageEnum = {
    js: 'JavaScript',
    plaintext: 'Shell',
  };

  const copyIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;
  const successIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`;

  useEffect(() => {
    const codeBlocks = Array.from(document.querySelectorAll('pre'));

    codeBlocks.forEach((codeBlock) => {
      if (codeBlock.parentElement?.classList.contains('copy-wrapper')) {
        return;
      }

      const languageType = codeBlock.getAttribute('data-language');
      const language = document.createElement('span');
      language.classList.add('white');

      language.textContent =
        LanguageEnum[languageType as keyof typeof LanguageEnum] || languageType;

      const wrapper = document.createElement('div');
      const wrapperContainer = document.createElement('div');

      wrapperContainer.appendChild(language);
      wrapper.className = 'copy-wrapper';
      wrapper.style.position = 'relative';

      const copyButton = document.createElement('button');
      // copyButton.className = 'button button-tiny button-transparent';
      copyButton.style.backgroundColor = 'transparent';
      copyButton.style.border = 'none';
      copyButton.style.cursor = 'pointer';
      copyButton.innerHTML = copyIcon;

      copyButton.addEventListener('click', async () => {
        const codeElement = codeBlock.querySelector('code');
        const textToCopy = codeElement?.innerText || '';

        try {
          await navigator.clipboard.writeText(textToCopy);
          copyButton.innerHTML = successIcon;
          setTimeout(() => {
            copyButton.innerHTML = copyIcon;
          }, 700);
        } catch (err) {
          console.error('Failed to copy text:', err);
        }
      });

      codeBlock.parentNode?.insertBefore(wrapper, codeBlock);
      wrapper.appendChild(wrapperContainer);
      wrapperContainer.appendChild(copyButton);
      wrapper.appendChild(codeBlock);
    });
  }, []);

  return null;
};
