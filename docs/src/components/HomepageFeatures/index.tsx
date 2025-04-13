import React, { type JSX } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'AI-Powered Development',
    Svg: require('@site/static/img/ai-brain.svg').default,
    description: (
      <>
        Leverage the power of AI to enhance your development workflow.
        Get intelligent code suggestions, debugging help, and documentation generation.
      </>
    ),
  },
  {
    title: 'Git Worktree Management',
    Svg: require('@site/static/img/git-branch.svg').default,
    description: (
      <>
        Efficiently manage multiple feature branches with advanced Git worktree support.
        Create, merge, and clean up worktrees with simple commands.
      </>
    ),
  },
  {
    title: 'Smart Search & Debug',
    Svg: require('@site/static/img/search-code.svg').default,
    description: (
      <>
        Search through code with AI-powered understanding. Get intelligent
        debugging suggestions and solutions from Stack Overflow and GitHub.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className={styles.featureCard}>
        <div className={styles.featureIcon}>
          <Svg role="img" />
        </div>
        <div className={styles.featureContent}>
          <Heading as="h3">{title}</Heading>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
