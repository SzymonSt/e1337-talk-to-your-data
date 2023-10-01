import React, { FC, useEffect, useRef } from "react";
import styles from "./Bubbles.module.css";
import Bubble from "./Bubble/Bubble";
import { Message } from "../../../types";
import { MessageType, WHO } from "../../../enums";

interface BubbleProps {
  messages: Message[];
  onSQLModifyClick?: (content: string) => void;
  onSQLExecuteClick?: (contents: string) => void;
  isAiAnswerLoading?: boolean;
}

const Bubbles: FC<BubbleProps> = ({ isAiAnswerLoading = false, ...props }) => {
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

      {isAiAnswerLoading && (
        <Bubble
          onSQLModifyClick={props.onSQLModifyClick}
          onSQLExecuteClick={props.onSQLExecuteClick}
          who={WHO.AI}
          key={"LOADING"}
          isIconShown={true}
          content={undefined}
          type={MessageType.LOADER}
        ></Bubble>
      )}

      <div ref={bottomRef} />
    </div>
  );
};

export default Bubbles;
