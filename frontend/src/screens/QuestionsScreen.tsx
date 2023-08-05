import { Outlet } from "react-router-dom";
import QuestionsContainer from "@/components/questions/QuestionsContainer";
import { QuestionProvider } from "@/providers/QuestionProvider";
import useDocumentTitle from "@utils/useDocumentTitle";

const QuestionsScreen = () => {
  useDocumentTitle();
  return (
    <QuestionProvider>
      <QuestionsContainer>
        <Outlet />
      </QuestionsContainer>
    </QuestionProvider>
  );
};

export default QuestionsScreen;
