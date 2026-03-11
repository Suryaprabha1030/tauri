export default function UserIcon(props: { color: string; active: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={props.active ? props.color : "none"}
      width="24px"
      height="24px"
    >
      <g id="Tab icons">
        <path
          id="Vector"
          d="M11 13.75C14.0376 13.75 16.5 11.2876 16.5 8.25C16.5 5.21243 14.0376 2.75 11 2.75C7.96243 2.75 5.5 5.21243 5.5 8.25C5.5 11.2876 7.96243 13.75 11 13.75Z"
          stroke={props.color}
          strokeWidth="1.5"
          strokeMiterlimit="10"
        />
        <path
          id="Vector_2"
          d="M2.66406 18.5623C3.50877 17.0989 4.72384 15.8837 6.18712 15.0388C7.65039 14.1938 9.31031 13.749 11 13.749C12.6897 13.749 14.3496 14.1938 15.8129 15.0388C17.2762 15.8837 18.4912 17.0989 19.3359 18.5623"
          stroke={props.color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
