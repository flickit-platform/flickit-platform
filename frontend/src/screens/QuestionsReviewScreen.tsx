import { t } from "i18next";
import QuestionsContainer from "@/components/questions/QuestionsContainer";
import QuestionsReview from "@/components/questions/QuestionsReview";
import { QuestionProvider } from "@/providers/QuestionProvider";
import useDocumentTitle from "@utils/useDocumentTitle";

const QuestionsReviewContainer = () => {
  useDocumentTitle(t("reviewQuestions") as string);

  return (
    <QuestionProvider>
      <QuestionsContainer isReview={true}>
        <QuestionsReview />
      </QuestionsContainer>
    </QuestionProvider>
  );
};

export default QuestionsReviewContainer;
