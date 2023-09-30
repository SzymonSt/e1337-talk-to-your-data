import React, { FC, useEffect, useRef } from "react";
import styles from "./Bubbles.module.css";
import { MessageType, WHO } from "../../../enums";
import Bubble from "./Bubble/Bubble";

interface BubbleProps {
  messages: Message[];
  onSQLModifyClick?: (content: string) => void;
}

export interface Message {
  id: number;
  who: WHO;
  content: any;
  type: MessageType;
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
