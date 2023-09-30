import React, { FC } from "react";
import styles from "./TableExtension.module.css";

interface TableExtensionProps {
  content: Object[];
}

const TableExtension: FC<TableExtensionProps> = (props) => {
  return (
    <div className={styles.TableExtension}>
      {props.content.length === 0 && "No data returned"}
      {props.content.length > 0 && (
        <table>
          <tr>
            {Object.keys(props.content[0]).map((key) => (
              <th>{key}</th>
            ))}
          </tr>

          {props.content.map((obj) => {
            return (
              <tr>
                {Object.values(obj).map((value: string | number) => (
                  <td>{value}</td>
                ))}
              </tr>
            );
          })}
        </table>
      )}
    </div>
  );
};

export default TableExtension;
