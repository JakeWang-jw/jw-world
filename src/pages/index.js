import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();

  return (
    <header className={styles.heroBanner}>
      <div className={styles.heroContent}>
        <div className={styles.greeting}>👋 你好，我是</div>
        <Heading as="h1" className={styles.heroTitle}>
          JW
        </Heading>
        <p className={styles.heroSubtitle}>嵌入式软件工程师</p>
        <p className={styles.heroDescription}>
          专注于嵌入式系统开发，熟悉 <code>C/C++</code>，同时对音视频相关技术充满热情。
          <br />
          我的技术探索主要聚焦于<strong>音视频技术在嵌入式设备上的落地应用</strong>——
          <br />
          从编解码优化到实时流处理，致力于在资源受限的环境中实现极致的多媒体体验。
        </p>

        <div className={styles.techStack}>
          <span className={styles.techTag}>C/C++</span>
          <span className={styles.techTag}>流媒体开发</span>
          <span className={styles.techTag}>嵌入式 Linux</span>
        </div>

        <div className={styles.buttons}>
          <Link
            className={styles.primaryBtn}
            to="/docs">
            📝 阅读我的笔记
          </Link>
          <Link
            className={styles.secondaryBtn}
            href="https://github.com/JakeWang-jw">
            GitHub
          </Link>
        </div>
      </div>

      <div className={styles.decorativeCode}>
        <pre>{`// Hello World
#include <stdio.h>

int main() {
    printf("Welcome to JW's blog!\\n");
    return 0;
}`}</pre>
      </div>
    </header>
  );
}

export default function Home() {
  return (
    <Layout
      title="首页"
      description="JW 的个人技术博客 - 嵌入式开发、音视频技术、C/C++">
      <HomepageHeader />
    </Layout>
  );
}
