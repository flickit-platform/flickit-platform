import { useEffect } from "react";
import Title from "@common/TitleComponent";
import SupTitleBreadcrumb from "@/components/common/SupTitleBreadcrumb";
import setDocumentTitle from "@utils/setDocumentTitle";
import { t } from "i18next";
import { useConfigContext } from "@/providers/ConfgProvider";
import { useParams } from "react-router-dom";

const KitDesignerTitle = () => {
  const { config } = useConfigContext();
  const { expertGroupId } = useParams();

  useEffect(() => {
    setDocumentTitle(`${t("kitDesigner")}`, config.appTitle);
  }, []);

  return (
    <Title
      backLink={"/"}
      size="large"
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
              title: t("expertGroups") as string,
              to: `/user/expert-groups`,
            },
            // {
            //   // title: expertGroup?.title,
            //   to: `/user/expert-groups/${expertGroupId}`,
            // },

            { title: `${t("kitDesigner")}` },
          ]}
          displayChip
        />
      }
    ></Title>
  );
};

export default KitDesignerTitle;
