import { useEffect } from "react";
import Title from "@common/TitleComponent";
import SupTitleBreadcrumb from "@/components/common/SupTitleBreadcrumb";
import setDocumentTitle from "@utils/setDocumentTitle";
import { t } from "i18next";
import { useConfigContext } from "@/providers/ConfgProvider";


const KitDesignerTitle = () => {
  const { config } = useConfigContext();

  useEffect(() => {
    setDocumentTitle(
      `${t("kitDesigner")}`,
      config.appTitle,
    );
  }, []);

  return (
    <Title
      backLink="/"
      wrapperProps={{
        sx: {
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "flex-start", md: "flex-end" },
        },
      }}
      sup={
        <SupTitleBreadcrumb
          routes={[
            {
              title: `${t("kitDesigner")}`,
            },
          ]}
          displayChip
        />
      }
    > </Title>
  );
};

export default KitDesignerTitle;
