
/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
      // ビルド時のエラーを無視する設定
      ignoreBuildErrors: true,
    },
    webpack(config) {
      // その他の設定をここに追加できます
      return config;
    },
  };
  
  export default nextConfig;
  