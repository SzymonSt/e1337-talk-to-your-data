import { FC, useContext, useEffect, useState } from "react";
import styles from "./Schema.module.css";
import CodeMirror from "@uiw/react-codemirror";
import { ViewUpdate } from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import { Button } from "react-bootstrap";
import { languageContext } from "../../context/LanguageContext";
import AxiosClient from "../../services/AxiosClient";
import SchemaTable from "./SchemaTable/SchemaTable";

interface SchemaProps {}

export interface TableProperties {
  name: string;
  [key: string]: string | number | boolean;
}

const Schema: FC<SchemaProps> = (props) => {
  const [tablesProperties, setTablesProperties] = useState<TableProperties[]>(
    []
  );

  const langCtx = useContext(languageContext);

  const [sqlInput, setSqlInput] = useState("");
  const onChange = (val: string, viewUpdate: ViewUpdate) => {
    setSqlInput(val);
  };

  const onSaveHandler = async () => {
    await AxiosClient.getInstance().post("/send-sql", {
      sql: sqlInput,
    });

    const response = await AxiosClient.getInstance().get("/get-schema");
    setTablesProperties(response.data);
  };

  useEffect(() => {
    const download = async () => {
      const response = await AxiosClient.getInstance().get("/get-schema");
      setTablesProperties(response.data);
    };
    download();
  }, []);

  return (
    <div className={styles.Schema}>
      <div className={styles.TablesView}>
        {tablesProperties.map((tableProperties) => (
          <SchemaTable
            key={tableProperties["name"]}
            properties={tableProperties}
          />
        ))}
      </div>
      <div className={styles.SQLInput}>
        <Button
          variant="primary"
          className={styles.SaveButton}
          onClick={onSaveHandler}
        >
          {langCtx.language === "ENG" ? "Execute SQL" : "Wykonaj SQL"}
        </Button>
        <CodeMirror
          className={styles.CodeEditor}
          value={sqlInput}
          theme={"dark"}
          height="100%"
          extensions={[sql({})]}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default Schema;
