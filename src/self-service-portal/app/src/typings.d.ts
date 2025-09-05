interface Window {
  __CONFIG__?: WindowBootstrapUiConfig;
}

interface WindowBootstrapUiConfig {
  appBasePath: string;
  bffBaseUrl: string;
  metadataPath: string;
  theme: {
    logoImage: string;
    loginImage: string;
  }
}
