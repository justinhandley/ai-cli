import React, { type JSX, useEffect, useState } from 'react';
import styles from './styles.module.css';

const commands = [
  'ai search "How to implement authentication in Next.js"',
  'ai debug "TypeError: Cannot read property of undefined"',
  'ai worktree feature-auth feature-ui',
  'ai describe ./src/components/Auth.tsx',
  'ai collect ./src',
];

export default function TypeWriter(): JSX.Element {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [commandIndex, setCommandIndex] = useState(0);
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    const currentCommand = commands[commandIndex];
    const timeoutDelay = isDeleting ? 50 : 100; // Faster deletion than typing
    const waitTime = 2000; // Time to wait before deleting

    if (isWaiting) {
      const waitTimer = setTimeout(() => {
        setIsWaiting(false);
        setIsDeleting(true);
      }, waitTime);
      return () => clearTimeout(waitTimer);
    }

    if (isDeleting) {
      if (text === '') {
        setIsDeleting(false);
        setCommandIndex((prev) => (prev + 1) % commands.length);
      } else {
        const timer = setTimeout(() => {
          setText(text.slice(0, -1));
        }, timeoutDelay);
        return () => clearTimeout(timer);
      }
    } else {
      if (text === currentCommand) {
        setIsWaiting(true);
      } else {
        const timer = setTimeout(() => {
          setText(currentCommand.slice(0, text.length + 1));
        }, timeoutDelay);
        return () => clearTimeout(timer);
      }
    }
  }, [text, isDeleting, commandIndex, isWaiting]);

  return (
    <div className={styles.typewriter}>
      <span className={styles.prompt}>$</span>
      <span className={styles.command}>{text}</span>
      <span className={styles.cursor}></span>
    </div>
  );
} 