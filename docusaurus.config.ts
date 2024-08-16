import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Yasee 文档中心.',
  tagline: 'Yasee 移动平台文档中心. 欢迎您的到来',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'http://henrygao.hopto.org',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'Yasee', // Usually your GitHub org/user name.
  projectName: 'yaseeSdk', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        // blog: {
        //   showReadingTime: true,
        //   // Please change this to your repo.
        //   // Remove this to remove the "edit this page" links.
        //   editUrl:
        //     'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        // },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'Yasee',
      logo: {
        alt: 'Yasee',
        src: 'img/logo.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'mobileSidebarId',
          position: 'left',
          label: '移动端文档',
        },
        {
          type: 'docSidebar',
          sidebarId: 'thirdId',
          position: 'left',
          label: '方案商对接规范',
        },
        {
          href: 'https://github.com/HenryGaoGH/yasee.io',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '文档中心',
          items: [
            {
              label: 'Yasee 移动端SDK',
              to: '/docs/welcome_yasee',
            },
          ],
        },
        {
          title: '其余产品',
          items: [
            {
              label: 'Yasee 慢病管理平台',
              href: 'https://wechat.yasee.com.cn',
            },
            // {
            //   label: 'Discord',
            //   href: 'https://discordapp.com/invite/docusaurus',
            // },
            // {
            //   label: 'Twitter',
            //   href: 'https://twitter.com/docusaurus',
            // },
          ],
        },
        {
          title: '更多关于',
          items: [
            // {
            //   label: 'Blog',
            //   to: '/blog',
            // },
            // {
            //   label: 'HenryGao(作者✍️)',
            //   href: 'https://github.com/henrygaoGH',
            // },
            {
              label: 'Yasee(作者✍️)',
              href: 'https://www.yasee-med.com',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Yasee Mobile Group, Inc.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    metadata: [
      {
        name: 'google-adsense-account',
        content: 'ca-pub-8213337084986125',
      },{
        name: 'google-site-verification',
        content: 'yop1-8-1a8M9AeoRBn8SMjSDJ-oVVo5qvUiZyhSwllc',
      }
    ]
  } satisfies Preset.ThemeConfig,

  scripts: [
    {
      src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
      async: true,
      crossorigin: 'anonymous',
      'data-ad-client': 'ca-pub-8213337084986125',
    }
  ]
};

export default config;
