import React from "react";

const SPACE = "%20";
const NEW_LINE = "%0D%0A";
const EMAIL = "segment-anything@meta.com";
const SUBJECT = "Segment Anything Demo Feedback";
const BODY = `Hello Segment Anything team,${NEW_LINE}${NEW_LINE}I'd like to give you some feedback about your demo.`;

const subject = SUBJECT.replaceAll(" ", SPACE);
const body = BODY.replaceAll(" ", SPACE);

const FeedbackModal = () => {
  return (
    <div className="modal" id="feedback-modal">
      <div className="modal-box">
        <div className="flex flex-row justify-between mb-2 text-sm">
          <h3 className="text-xl">Feedback</h3>
          <span>
            <a href="#" className="font-bold">
              Close
            </a>
          </span>
        </div>
        <p>
          Please email all feedback to <br className="md:hidden" />
          <a
            href={`mailto:${EMAIL}?subject=${subject}&body=${body}`}
            style={{ fontWeight: "bold" }}
            className="hover:underline"
          >
            {EMAIL}
          </a>
        </p>
      </div>
    </div>
  );
};

export default FeedbackModal;
