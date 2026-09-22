const CONTACT_ANIMATION_CSS = `
  .contact-page .contact-reveal {
    opacity: 0;
    transform: translate3d(0, 24px, 0);
    transition:
      opacity 700ms ease,
      transform 700ms cubic-bezier(.22, 1, .36, 1);
    transition-delay: var(--contact-delay, 0ms);
  }

  .contact-page .contact-reveal[data-reveal="left"] {
    transform: translate3d(-24px, 0, 0);
  }

  .contact-page .contact-reveal[data-reveal="right"] {
    transform: translate3d(24px, 0, 0);
  }

  .contact-page .contact-reveal[data-reveal="fade"] {
    transform: none;
  }

  .contact-page .contact-reveal.is-visible {
    opacity: 1;
    transform: none;
  }

  .contact-page .contact-accent-line {
    transform: scaleX(0);
    transform-origin: left center;
    transition: transform 650ms cubic-bezier(.22, 1, .36, 1);
  }

  .contact-page .contact-reveal.is-visible .contact-accent-line {
    transform: scaleX(1);
  }

  @keyframes contactBannerIn {
    from {
      opacity: 0.8;
      transform: scale(1.04);
    }

    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes contactBannerZoom {
    from {
      transform: scale(1);
    }

    to {
      transform: scale(1.08);
    }
  }

  .contact-page .contact-banner-image {
    animation:
      contactBannerIn 1100ms ease-out both,
      contactBannerZoom 14s ease-in-out 1100ms infinite alternate;
  }

  .contact-page .contact-interactive {
    transition:
      transform 250ms ease,
      box-shadow 250ms ease;
  }

  .contact-page .contact-detail-icon {
    transition: transform 250ms ease;
  }

  .contact-page .contact-input {
    transition:
      border-color 200ms ease,
      box-shadow 200ms ease;
  }

  .contact-page .contact-input:focus {
    box-shadow: 0 0 0 3px rgba(23, 119, 63, 0.10);
  }

  @media (hover: hover) and (pointer: fine) {
    .contact-page .contact-interactive:hover {
      transform: translateY(-3px);
    }

    .contact-page .contact-interactive:hover .contact-detail-icon {
      transform: scale(1.06);
    }

    .contact-page .contact-submit:hover:not(:disabled) {
      transform: translateY(-2px);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .contact-page .contact-reveal,
    .contact-page .contact-reveal[data-reveal],
    .contact-page .contact-accent-line,
    .contact-page .contact-banner-image,
    .contact-page .contact-interactive,
    .contact-page .contact-detail-icon,
    .contact-page .contact-input,
    .contact-page .contact-submit {
      animation: none !important;
      transition: none !important;
      transform: none !important;
    }

    .contact-page .contact-reveal {
      opacity: 1 !important;
    }
  }
`;

export default CONTACT_ANIMATION_CSS;
