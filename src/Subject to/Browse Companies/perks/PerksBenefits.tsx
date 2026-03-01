import React from "react";
import "./PerksBenefits.css";
import { motion } from "framer-motion";

interface Perk {
  icon: JSX.Element;
  title: string;
  description: string;
}

const perks: Perk[] = [
  {
    icon: (
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_323_20919)">
          <path
            d="M12 8H10C8.93913 8 7.92172 8.42143 7.17157 9.17157C6.42143 9.92172 6 10.9391 6 12V19C6 21.9174 7.15893 24.7153 9.22183 26.7782C11.2847 28.8411 14.0826 30 17 30C19.9174 30 22.7153 28.8411 24.7782 26.7782C26.8411 24.7153 28 21.9174 28 19V12C28 10.9391 27.5786 9.92172 26.8284 9.17157C26.0783 8.42143 25.0609 8 24 8H22"
            stroke="#578BC7"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M16 30C16 31.5759 16.3104 33.1363 16.9134 34.5922C17.5165 36.0481 18.4004 37.371 19.5147 38.4853C20.629 39.5996 21.9519 40.4835 23.4078 41.0866C24.8637 41.6896 26.4241 42 28 42C29.5759 42 31.1363 41.6896 32.5922 41.0866C34.0481 40.4835 35.371 39.5996 36.4853 38.4853C37.5996 37.371 38.4835 36.0481 39.0866 34.5922C39.6896 33.1363 40 31.5759 40 30V24"
            stroke="#578BC7"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M22 6V10"
            stroke="#578BC7"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M12 6V10"
            stroke="#578BC7"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M40 24C42.2091 24 44 22.2091 44 20C44 17.7909 42.2091 16 40 16C37.7909 16 36 17.7909 36 20C36 22.2091 37.7909 24 40 24Z"
            stroke="#578BC7"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_323_20919">
            <rect width="48" height="48" fill="white" />
          </clipPath>
        </defs>
      </svg>
    ),
    title: "Full Healthcare",
    description:
      "We believe in thriving communities and that starts with our team being happy and healthy.",
  },
  {
    icon: (
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_323_20930)">
          <path
            d="M4 40.0001C4.45434 40.6331 5.05594 41.1459 5.75285 41.4944C6.44975 41.8428 7.22101 42.0164 8 42.0001C8.77899 42.0164 9.55025 41.8428 10.2472 41.4944C10.9441 41.1459 11.5457 40.6331 12 40.0001C12.4543 39.3671 13.0559 38.8542 13.7528 38.5058C14.4498 38.1573 15.221 37.9838 16 38.0001C16.779 37.9838 17.5502 38.1573 18.2472 38.5058C18.9441 38.8542 19.5457 39.3671 20 40.0001C20.4543 40.6331 21.0559 41.1459 21.7528 41.4944C22.4498 41.8428 23.221 42.0164 24 42.0001C24.779 42.0164 25.5502 41.8428 26.2472 41.4944C26.9441 41.1459 27.5457 40.6331 28 40.0001C28.4543 39.3671 29.0559 38.8542 29.7528 38.5058C30.4498 38.1573 31.221 37.9838 32 38.0001C32.779 37.9838 33.5502 38.1573 34.2472 38.5058C34.9441 38.8542 35.5457 39.3671 36 40.0001C36.4543 40.6331 37.0559 41.1459 37.7528 41.4944C38.4498 41.8428 39.221 42.0164 40 42.0001C40.779 42.0164 41.5502 41.8428 42.2472 41.4944C42.9441 41.1459 43.5457 40.6331 44 40.0001"
            stroke="#578BC7"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M4 32.0001C4.45434 32.6331 5.05594 33.1459 5.75285 33.4944C6.44975 33.8428 7.22101 34.0164 8 34.0001C8.77899 34.0164 9.55025 33.8428 10.2472 33.4944C10.9441 33.1459 11.5457 32.6331 12 32.0001C12.4543 31.3671 13.0559 30.8542 13.7528 30.5058C14.4498 30.1573 15.221 29.9838 16 30.0001C16.779 29.9838 17.5502 30.1573 18.2472 30.5058C18.9441 30.8542 19.5457 31.3671 20 32.0001C20.4543 32.6331 21.0559 33.1459 21.7528 33.4944C22.4498 33.8428 23.221 34.0164 24 34.0001C24.779 34.0164 25.5502 33.8428 26.2472 33.4944C26.9441 33.1459 27.5457 32.6331 28 32.0001C28.4543 31.3671 29.0559 30.8542 29.7528 30.5058C30.4498 30.1573 31.221 29.9838 32 30.0001C32.779 29.9838 33.5502 30.1573 34.2472 30.5058C34.9441 30.8542 35.5457 31.3671 36 32.0001C36.4543 32.6331 37.0559 33.1459 37.7528 33.4944C38.4498 33.8428 39.221 34.0164 40 34.0001C40.779 34.0164 41.5502 33.8428 42.2472 33.4944C42.9441 33.1459 43.5457 32.6331 44 32.0001"
            stroke="#578BC7"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M30 24V9C30 8.20435 30.3161 7.44129 30.8787 6.87868C31.4413 6.31607 32.2044 6 33 6C33.7956 6 34.5587 6.31607 35.1213 6.87868C35.6839 7.44129 36 8.20435 36 9"
            stroke="#578BC7"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M18 24V9C18 8.20435 17.6839 7.44129 17.1213 6.87868C16.5587 6.31607 15.7956 6 15 6C14.2044 6 13.4413 6.31607 12.8787 6.87868C12.3161 7.44129 12 8.20435 12 9"
            stroke="#578BC7"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M30 10H18"
            stroke="#578BC7"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M18 20H30"
            stroke="#578BC7"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_323_20930">
            <rect width="48" height="48" fill="white" />
          </clipPath>
        </defs>
      </svg>
    ),
    title: "Unlimited Vacation",
    description:
      "We believe you should have a flexible schedule that makes space for family, wellness, and fun.",
  },
  {
    icon: (
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_323_20942)">
          <path
            d="M30 20L39.106 15.448C39.4108 15.2957 39.7496 15.2238 40.09 15.2391C40.4304 15.2544 40.7613 15.3565 41.0512 15.5356C41.3411 15.7147 41.5805 15.9649 41.7465 16.2625C41.9126 16.5601 41.9998 16.8952 42 17.236V30.764C41.9998 31.1048 41.9126 31.4399 41.7465 31.7374C41.5805 32.035 41.3411 32.2853 41.0512 32.4644C40.7613 32.6435 40.4304 32.7456 40.09 32.7609C39.7496 32.7762 39.4108 32.7043 39.106 32.552L30 28V20Z"
            stroke="#578BC7"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M26 12H10C7.79086 12 6 13.7909 6 16V32C6 34.2091 7.79086 36 10 36H26C28.2091 36 30 34.2091 30 32V16C30 13.7909 28.2091 12 26 12Z"
            stroke="#578BC7"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_323_20942">
            <rect width="48" height="48" fill="white" />
          </clipPath>
        </defs>
      </svg>
    ),
    title: "Skill Development",
    description:
      "We believe in always learning and leveling up our skills. Whether it's a conference or online course.",
  },
  {
    icon: (
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_323_20942)">
          <path
            d="M30 20L39.106 15.448C39.4108 15.2957 39.7496 15.2238 40.09 15.2391C40.4304 15.2544 40.7613 15.3565 41.0512 15.5356C41.3411 15.7147 41.5805 15.9649 41.7465 16.2625C41.9126 16.5601 41.9998 16.8952 42 17.236V30.764C41.9998 31.1048 41.9126 31.4399 41.7465 31.7374C41.5805 32.035 41.3411 32.2853 41.0512 32.4644C40.7613 32.6435 40.4304 32.7456 40.09 32.7609C39.7496 32.7762 39.4108 32.7043 39.106 32.552L30 28V20Z"
            stroke="#578BC7"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M26 12H10C7.79086 12 6 13.7909 6 16V32C6 34.2091 7.79086 36 10 36H26C28.2091 36 30 34.2091 30 32V16C30 13.7909 28.2091 12 26 12Z"
            stroke="#578BC7"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_323_20942">
            <rect width="48" height="48" fill="white" />
          </clipPath>
        </defs>
      </svg>
    ),
    title: "Team Summits",
    description:
      "Every 6 months we have a full team summit where we have fun, reflect, and plan for the upcoming quarter.",
  },
  {
    icon: (
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_323_20958)">
          <path
            d="M6 28.0001C7.66 29.2841 10.154 30.0341 13 30.0001C15.846 30.0341 18.34 29.2841 20 28.0001C21.66 26.7161 24.154 25.9661 27 26.0001C29.846 25.9661 32.34 26.7161 34 28.0001"
            stroke="#578BC7"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M15.9996 6C15.3666 6.45434 14.8537 7.05594 14.5053 7.75285C14.1568 8.44975 13.9833 9.22101 13.9996 10C13.9833 10.779 14.1568 11.5502 14.5053 12.2472C14.8537 12.9441 15.3666 13.5457 15.9996 14"
            stroke="#578BC7"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M23.9996 6C23.3666 6.45434 22.8537 7.05594 22.5053 7.75285C22.1568 8.44975 21.9833 9.22101 21.9996 10C21.9833 10.779 22.1568 11.5502 22.5053 12.2472C22.8537 12.9441 23.3666 13.5457 23.9996 14"
            stroke="#578BC7"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M6 20H34V30C34 33.1826 32.7357 36.2348 30.4853 38.4853C28.2348 40.7357 25.1826 42 22 42H18C14.8174 42 11.7652 40.7357 9.51472 38.4853C7.26428 36.2348 6 33.1826 6 30V20Z"
            stroke="#578BC7"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M33.4922 33.4519C34.3854 33.8619 35.3656 34.0463 36.3468 33.9887C37.3279 33.9312 38.2799 33.6335 39.119 33.1218C39.9581 32.6102 40.6587 31.9003 41.1592 31.0544C41.6597 30.2086 41.9447 29.2527 41.9892 28.2709C42.0338 27.2891 41.8365 26.3114 41.4146 25.4237C40.9928 24.5361 40.3593 23.7656 39.57 23.1801C38.7806 22.5945 37.8595 22.2119 36.8876 22.0657C35.9157 21.9196 34.9228 22.0144 33.9962 22.3419"
            stroke="#578BC7"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_323_20958">
            <rect width="48" height="48" fill="white" />
          </clipPath>
        </defs>
      </svg>
    ),
    title: "Remote Working",
    description:
      "You know how you perform your best. Work from home, coffee shop or anywhere when you feel like it.",
  },
  {
    icon: (
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_323_20969)">
          <path
            d="M42 26C42 18.26 35.26 12 22 12H6"
            stroke="#578BC7"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M6 30H38C39.0609 30 40.0783 29.5786 40.8284 28.8284C41.5786 28.0783 42 27.0609 42 26"
            stroke="#578BC7"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M6 12V22H41"
            stroke="#578BC7"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M6 20V28"
            stroke="#578BC7"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M16 22V12"
            stroke="#578BC7"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M26 22V13"
            stroke="#578BC7"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M6 38H42"
            stroke="#578BC7"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_323_20969">
            <rect width="48" height="48" fill="white" />
          </clipPath>
        </defs>
      </svg>
    ),
    title: "Commuter Benefits",
    description:
      "We're grateful for all the time and energy each team member puts into getting to work every day.",
  },
  {
    icon: (
      <svg
        width="41"
        height="41"
        viewBox="0 0 41 41"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M39.1882 3.44842C38.5034 2.78107 37.598 2.42779 36.6426 2.45185C34.7548 2.50052 33.219 4.10069 33.219 6.01915V14.918C31.9821 14.4827 30.5486 14.7587 29.5613 15.7462L20.7913 24.5161C20.5947 24.7127 20.4147 24.9214 20.2502 25.1397C20.0856 24.9213 19.9055 24.7127 19.709 24.516L10.9391 15.7461C9.9518 14.7587 8.51827 14.4827 7.28131 14.9179V5.96633C7.28131 5.01007 6.90412 4.11585 6.21919 3.44842C5.53442 2.78107 4.62957 2.42763 3.67362 2.45185C1.78587 2.50052 0.25 4.10069 0.25 6.01915V19.1614C0.25 20.3603 0.589065 21.5293 1.23048 22.5419L7.69014 32.7406C8.28319 33.6769 8.59671 34.7577 8.59671 35.866V39.078C8.59671 39.7252 9.1214 40.2499 9.76859 40.2499H30.7319C31.3791 40.2499 31.9038 39.7252 31.9038 39.078V35.866C31.9038 34.7577 32.2172 33.6769 32.8103 32.7407L39.2699 22.542C39.9113 21.5293 40.2503 20.3603 40.2503 19.1614V5.96633C40.2503 5.01015 39.8731 4.11593 39.1882 3.44842ZM9.67015 31.4865L3.21049 21.2878C2.80697 20.6508 2.59377 19.9155 2.59377 19.1614V6.01915C2.59377 5.36031 3.10526 4.81109 3.73401 4.79492C4.05323 4.78718 4.35527 4.9046 4.58347 5.12695C4.81176 5.34945 4.93754 5.64758 4.93754 5.96633V18.2711C4.93754 18.3037 4.9398 18.3357 4.94238 18.3675C4.97504 19.2221 5.31621 20.067 5.96723 20.718L10.2417 24.9925C10.6993 25.4502 11.4413 25.4502 11.899 24.9925C12.3567 24.5348 12.3567 23.7929 11.899 23.3352L7.62451 19.0607C7.16763 18.6038 7.16763 17.8603 7.62451 17.4035C8.08155 16.9466 8.82491 16.9466 9.28187 17.4035L18.0516 26.1732C18.7137 26.8354 19.0783 27.7192 19.0783 28.6618V37.9061H10.9404V35.866C10.9404 34.313 10.5012 32.7986 9.67015 31.4865ZM37.9066 19.1614C37.9066 19.9155 37.6933 20.6508 37.2897 21.2878L30.8302 31.4865C29.9991 32.7985 29.5599 34.313 29.5599 35.866V37.9061H21.422V28.6618C21.422 27.7192 21.7867 26.8354 22.4486 26.1733L31.2185 17.4034C31.6756 16.9465 32.4189 16.9465 32.8758 17.4034C33.3305 17.8399 33.3305 18.6244 32.8755 19.061L28.6013 23.338C28.1439 23.7958 28.1441 24.5377 28.6019 24.9952C29.0595 25.4527 29.8015 25.4526 30.2592 24.9947L34.5331 20.718C35.1793 20.0718 35.5419 19.2182 35.561 18.3074C35.5614 18.2953 35.5628 18.2834 35.5628 18.2711V6.01915C35.5628 5.36031 36.0743 4.81109 36.703 4.79492C37.0206 4.78624 37.3242 4.9046 37.5525 5.12695C37.7808 5.34953 37.9066 5.64766 37.9066 5.96641V19.1614Z"
          fill="#578BC7"
          stroke="#578BC7"
          stroke-width="0.5"
        />
        <path
          d="M12.0838 10.5805C12.1339 10.6349 12.3064 10.8049 15.5899 14.0066C17.3024 15.6766 19.242 17.5679 19.3982 17.7254C19.6189 17.955 19.9238 18.0852 20.243 18.0852C20.5666 18.0853 20.8757 17.9514 21.0971 17.7159C21.2641 17.5439 23.0573 15.7984 24.6403 14.2574C27.4119 11.5594 28.2925 10.7003 28.4027 10.5807C28.4281 10.5533 28.4519 10.5248 28.4741 10.4955C32.2622 5.68712 28.8123 0.288562 23.9227 0.265358C22.5957 0.285827 21.337 0.741456 20.2311 1.59349C17.3834 -0.561523 14.2502 0.137779 12.396 1.85232C9.89462 4.13742 9.77056 7.95386 12.0495 10.5416C12.0607 10.5548 12.0721 10.5678 12.0838 10.5805ZM13.9873 3.57312C15.1806 2.46944 17.3198 1.91568 19.4203 3.98711C19.6431 4.20672 19.9456 4.32789 20.2571 4.32445C20.5699 4.3207 20.8682 4.19211 21.0856 3.96726C22.3864 2.62194 24.6351 1.92279 26.4987 3.56617C27.7165 4.64016 28.4831 6.70752 26.6589 9.0127C26.3645 9.30824 24.5089 11.1146 23.0054 12.5781C21.6786 13.8697 20.8014 14.724 20.2418 15.2706C19.4437 14.4894 14.415 9.5902 13.8122 8.9959C12.6199 7.55253 12.1699 5.25384 13.9873 3.57312Z"
          fill="#578BC7"
          stroke="#578BC7"
          stroke-width="0.5"
        />
      </svg>
    ),
    title: "We give back.",
    description:
      "We anonymously match any donation our employees make (up to $/£ 600) so they can support the organizations they care about most—times two.",
  },
];

// Variants for each card
const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.2,
      type: "spring",
      bounce: 0.3,
      duration: 0.8,
    },
  }),
};

const PerksBenefits: React.FC = () => {
  return (
    <div className="perks-container">
      <h2 className="perks-title">Perks & Benefits</h2>
      <p className="perks-subtitle">
        This job comes with several perks and benefits
      </p>
      <div className="perks-grid">
        {perks.map((perk, index) => (
          <motion.div
            key={index}
            className="perk-card"
            custom={index} // لتحديد تأخير كل بطاقة
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={cardVariants}
          >
            <div className="perk-icon">{perk.icon}</div>
            <h3 className="perk-title">{perk.title}</h3>
            <p className="perk-description">{perk.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PerksBenefits;
