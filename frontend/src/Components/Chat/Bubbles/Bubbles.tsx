import React, { FC, useEffect, useRef } from "react";
import styles from "./Bubbles.module.css";
import Bubble from "./Bubble/Bubble";
import { Message } from "../../../types";

interface BubbleProps {
  messages: Message[];
  onSQLModifyClick?: (content: string) => void;
  onSQLExecuteClick?: (contents: string) => void;
}

const Bubbles: FC<BubbleProps> = (props) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      if (props.messages.length) {
        bottomRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });

        bottomRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    });
  }, [props.messages.length]);

  return (
    <div className={styles.Bubbles}>
      {props.messages.map((message, index) => (
        <Bubble
          onSQLModifyClick={props.onSQLModifyClick}
          onSQLExecuteClick={props.onSQLExecuteClick}
          who={message.who}
          key={message.id}
          isIconShown={
            index === 0 || props.messages[index - 1].who !== message.who
          }
          content={message.content}
          type={message.type}
        ></Bubble>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default Bubbles;
