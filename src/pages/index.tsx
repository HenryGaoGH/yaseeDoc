import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import Block from '@site/src/components/Block';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/welcome_yasee">
            快速查看 功能概览报告
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main>
        {/* <HomepageFeatures /> */}
        <Block right={true} title="更容易使用" desc="Yasee SDK 是 Yasee 移动端 SDK 的 Java、Swift 实现。" color='orange' />
        <Block right={false} title="更标准的协议集成" desc="在移动端 SDK 的基础上，可以使用 Yasee SDK 进行标准的协议集成。通过 标准协议 更好更快速的集成多家设备" color='black' />
      </main>
    </Layout>
  );
}
