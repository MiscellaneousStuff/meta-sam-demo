import React from "react";
import { Button } from "react-daisyui";
import Content from "./Content";
import FAQ from "./FAQ";
import FeatureSummary from "./FeatureSummary";
import Gallery from "./Gallery";
import { StageProps } from "./helpers/Interface";
import Hero from "./Hero";
import Stage from "./Stage";
import Video from "./Video";

const HomePage = ({
  scale,
  handleResetState,
  handleMagicErase,
  handleImage,
  hasClicked,
  setHasClicked,
  handleSelectedImage,
  image,
  model,
}: StageProps) => {
  return (
    <div className="relative flex flex-col items-center justify-center prose">
      <Hero
        overlay
        fullHeight
        image="/assets/horses.png"
        className="opacity-40"
        bgColor="black"
        video="/assets/header.mp4"
      >
        <FeatureSummary
          darkMode
          actions={[{ action: "Try the demo", actionUrl: "/demo" }]}
          useNavLink
        >
          <h6>AI Computer Vision Research</h6>
          <h2>
            <span className="md:text-4xl">
              Segment Anything Model (SAM): a new AI model from Meta AI that can
              "cut out" any object, in any image, with a single click
            </span>
          </h2>
          <h6>
            SAM is a promptable segmentation system with zero-shot
            generalization to unfamiliar objects and images, without the need
            for additional training.
          </h6>
        </FeatureSummary>
      </Hero>
      <Content spaceBottom spaceTop>
        <FeatureSummary
          centerAlign
          label="The research"
          className="mx-auto md:w-[54%]"
        >
          <h2>SAM uses a variety of input prompts</h2>
          <h6>
            Prompts specifying what to segment in an image allow for a wide
            range of segmentation tasks without the need for additional
            training.
          </h6>
        </FeatureSummary>
      </Content>
      <Gallery columns={3} fullWidth>
        <Video
          autoPlay
          loop
          controls={false}
          url="/assets/section-1.1a.mp4"
          caption="Prompt it with interactive points and boxes."
          className="mb-4 lg:mb-0"
        />
        <Video
          autoPlay
          loop
          controls={false}
          url="/assets/section-1.1b.mp4"
          caption="Automatically segment everything in an image."
          className="mb-4 lg:mb-0"
        />
        <Video
          autoPlay
          loop
          controls={false}
          url="/assets/section-1.1c.mp4"
          caption="Generate multiple valid masks for ambiguous prompts."
          className="mb-4 lg:mb-0"
        />
      </Gallery>
      <Content spaceTop spaceBottom centered>
        <FeatureSummary centerAlign className="mx-auto md:w-[56%]">
          <h2>
            SAM's promptable design enables flexible integration with other
            systems
          </h2>
        </FeatureSummary>
      </Content>
      <Gallery columns={2} fullWidth>
        <Video
          autoPlay
          loop
          controls={false}
          url="/assets/section-1.2a.mp4"
          caption="SAM can take input prompts from other systems, such as in the future taking a user's gaze from an AR/VR headset to select an object."
          className="mb-4 lg:mb-0"
        />
        <Video
          autoPlay
          loop
          controls={false}
          url="/assets/section-1.2b.mp4"
          caption="Bounding box prompts from an object detector can enable text-to-object segmentation."
          className="mb-4 lg:mb-0"
        />
      </Gallery>
      <Content
        imageRight="/assets/chairs.png"
        videoRight="/assets/section-1c.3.mp4"
        spaceTop
        spaceBottom
        centered
      >
        <h1>Extensible outputs</h1>
        <h6>
          Output masks can be used as inputs to other AI systems. For example,
          object masks can be tracked in videos, enable imaging editing
          applications, be{" "}
          <a
            href="https://mcc3d.github.io/"
            target="_blank"
            className="font-bold text-blue-600 hover:underline active:underline"
          >
            lifted to 3D
          </a>
          , or used for creative tasks like collaging.
        </h6>
      </Content>
      <Content
        noteRight="SAM has learned a general notion of what objects are -- this understanding enables zero-shot generalization to unfamiliar objects and images without requiring additional training."
        spaceTop
        spaceBottom
      >
        <h1>Zero-shot generalization</h1>
      </Content>
      <Gallery spaceBottom columns={3} fullWidth>
        <Video
          autoPlay
          loop
          controls={false}
          url="/assets/section-1.4a.mp4"
          className="mb-4 lg:mb-0"
        />
        <Video
          autoPlay
          loop
          controls={false}
          url="/assets/section-1.4b.mp4"
          className="mb-4 lg:mb-0"
        />
        <Video
          autoPlay
          loop
          controls={false}
          url="/assets/section-1.4c.mp4"
          className="mb-4 lg:mb-0"
        />
      </Gallery>
      <Content spaceTop spaceBottom color="gray" centered>
        <FeatureSummary centerAlign useNavLink label="Demonstration">
          <h2>Select a dog in the image</h2>
          <Button className="my-5 text-lg font-bold" href="/demo">
            <span>Go to demo</span>
            <svg
              width="36"
              height="36"
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20.9657 10.9997L27.9287 17.9627L20.9657 24.9258L19.7348 23.719L24.6203 18.8331L9.0001 18.8331V17.0924L24.5966 17.0924L19.7348 12.2306L20.9657 10.9997Z"
                fill="white"
              />
            </svg>
          </Button>
          <Stage
            scale={scale}
            handleResetState={handleResetState}
            handleMagicErase={handleMagicErase}
            handleImage={handleImage}
            hasClicked={hasClicked}
            setHasClicked={setHasClicked}
            handleSelectedImage={handleSelectedImage}
            image={image}
            isStandalone={true}
            model={model}
          />
        </FeatureSummary>
      </Content>
      <Content
        imageLeft="/assets/section-3.1a.jpg"
        videoLeft="/assets/section-3.1a.mp4"
        centered
      >
        <FeatureSummary
          label="Training the model"
          actions={[
            {
              action: "Read the blog post",
              actionUrl:
                "https://ai.facebook.com/blog/segment-anything-foundation-model-image-segmentation/",
            },
          ]}
        >
          <h2>SAM’s data engine</h2>
          <h6>
            SAM's advanced capabilities are the result of its training on
            millions of images and masks collected through the use of a
            model-in-the-loop "data engine." Researchers used SAM and its data
            to interactively annotate images and update the model. This cycle
            was repeated many times over to improve both the model and the
            dataset.
          </h6>
        </FeatureSummary>
      </Content>
      <Content
        imageRight="/assets/dataset.png"
        videoRight="/assets/section-3.1b.mp4"
        centered
        reorderForMobile
        spaceBottom
        spaceTop
      >
        <FeatureSummary
          actions={[
            { action: "Explore the dataset", actionUrl: "/dataset/index.html" },
            {
              action: "Download full dataset",
              actionUrl: "https://ai.facebook.com/datasets/segment-anything/",
            },
          ]}
        >
          <h2>11M images, 1B+ masks</h2>
          <h6>
            After annotating enough masks with SAM’s help, we were able to
            leverage SAM’s sophisticated ambiguity-aware design to annotate new
            images fully automatically. To do this, we present SAM with a grid
            of points on an image and ask SAM to segment everything at each
            point. Our final dataset includes more than 1.1 billion segmentation
            masks collected on ~11 million licensed and privacy preserving
            images.
          </h6>
        </FeatureSummary>
      </Content>
      <Content
        imageLeft="/assets/section-3.1c.png"
        videoLeft="/assets/section-3.1c.mp4"
        centered
        spaceBottom
        spaceTop
      >
        <FeatureSummary
          actions={[
            {
              action: "Read the paper",
              actionUrl: "https://arxiv.org/abs/2304.02643",
            },
          ]}
        >
          <h2>Efficient & flexible model design</h2>
          <h6>
            SAM is designed to be efficient enough to power its data engine. We
            decoupled the model into 1) a one-time image encoder and 2) a
            lightweight mask decoder that can run in a web-browser in just a few
            milliseconds per prompt.
          </h6>
        </FeatureSummary>
      </Content>
      <Content spaceTop>
        <h2>Frequently asked questions</h2>
      </Content>
      <Content centered spaceBottom className="flex flex-col gap-8 md:flex-row">
        <div className="flex flex-col md:flex-row gap-x-8">
          <div className="md:max-w-[50%]">
            <FAQ question="What type of prompts are supported?">
              <ul>
                <li>Foreground/background points</li>
                <li>Bounding box</li>
                <li>Mask</li>
                <li>
                  Text prompts are explored in our paper but the capability is
                  not released
                </li>
              </ul>
            </FAQ>
            <FAQ question="What is the structure of the model?">
              <ul>
                <li>
                  A ViT-H image encoder that runs once per image and outputs an
                  image embedding
                </li>
                <li>
                  A prompt encoder that embeds input prompts such as clicks or
                  boxes
                </li>
                <li>
                  A lightweight transformer based mask decoder that predicts
                  object masks from the image embedding and prompt embeddings
                </li>
              </ul>
            </FAQ>
            <FAQ question="What platforms does the model use?">
              <ul>
                <li>
                  The image encoder is implemented in PyTorch and requires a GPU
                  for efficient inference.
                </li>
                <li>
                  The prompt encoder and mask decoder can run directly with
                  PyTroch or converted to ONNX and run efficiently on CPU or GPU
                  across a variety of platforms that support ONNX runtime.
                </li>
              </ul>
            </FAQ>
            <FAQ question="How big is the model?">
              <ul>
                <li>The image encoder has 632M parameters.</li>
                <li>The prompt encoder and mask decoder have 4M parameters.</li>
              </ul>
            </FAQ>
            <FAQ
              question="How long does inference take?"
              className="md:border-b"
            >
              <ul>
                <li>
                  The image encoder takes ~0.15 seconds on an NVIDIA A100 GPU.
                </li>
                <li>
                  The prompt encoder and mask decoder take ~50ms on CPU in the
                  browser using multithreaded SIMD execution.
                </li>
              </ul>
            </FAQ>
          </div>
          <div className="md:max-w-[50%]">
            <FAQ question="What data was the model trained on?">
              <ul>
                <li>
                  The model was trained on our SA-1B dataset. See our{" "}
                  <a
                    href="https://segment-anything.com/dataset/index.html"
                    target={"_blank"}
                  >
                    dataset viewer.
                  </a>
                </li>
              </ul>
            </FAQ>
            <FAQ question="How long does it take to train the model?">
              <ul>
                <li>The model was trained for 3-5 days on 256 A100 GPUs.</li>
              </ul>
            </FAQ>
            <FAQ question="Does the model produce mask labels?">
              <ul>
                <li>
                  No, the model predicts object masks only and does not generate
                  labels.
                </li>
              </ul>
            </FAQ>
            <FAQ question="Does the model work on videos?">
              <ul>
                <li>
                  Currently the model only supports images or individual frames
                  from videos.
                </li>
              </ul>
            </FAQ>
            <FAQ question="Where can I find the code?" className="border-b">
              <ul>
                <li>
                  Code is available on{" "}
                  <a
                    href="https://github.com/facebookresearch/segment-anything"
                    target={"_blank"}
                  >
                    GitHub
                  </a>
                </li>
              </ul>
            </FAQ>
          </div>
        </div>
      </Content>
      <Content spaceTop color="gray" centered>
        <h2 className="text-center">Acknowledgements</h2>
      </Content>
      <Gallery columns={2} fullWidth color="gray" spaceBottom>
        <div>
          <span className="font-bold">Research Authors</span>
          <h6>
            Alexander Kirillov<sup>1,2,4</sup> Eric Mintun<sup>2</sup>, Nikhila
            Ravi
            <sup>1,2</sup>, Hanzi Mao<sup>2</sup>, Chloe Rolland<sup>3</sup>,
            Laura Gustafson<sup>3</sup>, Tete Xiao<sup>3</sup>, Spencer
            Whitehead, Alex Berg, Wan-Yen Lo, Piotr Dollar<sup>4</sup>, Ross
            Girshick
            <sup>4</sup>
          </h6>
          <p className="text-xs">
            <sup>1</sup> project lead, <sup>2</sup> joint first author,{" "}
            <sup>3</sup> equal contribution, <sup>4</sup> directional lead
          </p>
        </div>
        <div>
          <span className="font-bold">
            Project Contributors (alphabetical):
          </span>
          <h6>
            Aaron Adcock, Vaibhav Aggarwal, Morteza Behrooz, Cheng-Yang Fu,
            Ashley Gabriel, Ahuva Goldstand, Allen Goodman, Sumanth Gurram,
            Jiabo Hu, Somya Jain, Devansh Kukreja, Robert Kuo, Joshua Lane,
            Yanghao Li, Lilian Luong, Jitendra Malik, Mallika Malhotra, William
            Ngan, Omkar Parkhi, Nikhil Raina, Dirk Rowe, Neil Seejoor, Vanessa
            Stark, Bala Varadarajan, Bram Wasti, Zachary Winstrom
          </h6>
        </div>
      </Gallery>
      <Content spaceBottom spaceTop>
        <FeatureSummary
          actions={[{ action: "Sign up", actionUrl: "/" }]}
          centerAlign
          justifyCenter
        >
          <h2>
            Our latest updates <br className="hidden md:inline"></br>
            delivered to your inbox
          </h2>
          <h6>
            Sign up to receive our newsletter and be the first to know{" "}
            <br className="hidden md:inline"></br>
            about Meta Al news, events, research breakthroughs,{" "}
            <br className="hidden md:inline"></br>
            and more.
          </h6>
        </FeatureSummary>
      </Content>
    </div>
  );
};

export default HomePage;
