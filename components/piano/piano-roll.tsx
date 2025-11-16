import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';

import { urlParams } from '@/lib/config';
import type { Note } from '@/lib/core/Piano';
import type { ClassName } from '@/lib/types';

type Props = { activeNotes?: Note[]; chordIndex: number } & ClassName;

const SVG_WIDTH = 4346.38;
const SVG_HEIGHT = 524.24;

const PianoRoll = ({ activeNotes, chordIndex, className }: Props) => {
  const searchParams = useSearchParams();

  const color =
    (searchParams?.get(urlParams.color) as string) ??
    'hsl(var(--key-highlight))';

  const getKeyByCode = (code: number) => {
    return document.getElementsByClassName(`${code}`)[
      chordIndex
    ] as HTMLElement;
  };

  // const resetKeys = () => {
  //   // Reset all keys
  //   for (let index = MIN_KEY; index < MAX_KEY; index++) {
  //     const key = getKeyByCode(index)
  //     if (key) {
  //       key.style.fill = ""
  //     }
  //   }
  // }

  const highlightKeys = () => {
    activeNotes?.forEach((note) => {
      const key = getKeyByCode(note.code);

      if (key) {
        key.style.fill = color;
      }
    });
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: shh
  useEffect(() => {
    // resetKeys()
    highlightKeys();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNotes]);

  return (
    <Suspense>
      <div className={className}>
        <svg
          id="piano"
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}>
          <title>Piano Roll</title>
          <g id="piano-component-keys">
            <path
              id="21"
              data-name="21"
              className="21 fill-key"
              d="M.57,1.18l0,517.52,7.87,4.55H74.09l7.09-4.1.47-172.66H67.44V1.17Z"
            />
            <path
              id="22"
              data-name="22"
              className="22 fill-key-dark"
              d="M72,5.13V339.47h42.6V5.32Z"
            />
            <path
              id="23"
              data-name="23"
              className="23 fill-key"
              d="M119.68,1.12V346.71H83.51v172.4L91,523.43H156.8l7.23-4.17V1.12Z"
            />
            <path
              id="24"
              data-name="24"
              className="24 fill-key"
              d="M168,1.82h45.73V347.16h34.42V519.29L241.66,523H174.44l-6.86-4Z"
            />
            <path
              id="25"
              data-name="25"
              className="25 fill-key-dark"
              d="M221.37,5.86V340.2H264V6.05Z"
            />
            <path
              id="26"
              data-name="26"
              className="26 fill-key"
              d="M269.49,1.3V347.05H251.24V519l7.56,4.37h65.85l6.9-4V346.86H313.81V1.3Z"
            />
            <path
              id="27"
              data-name="27"
              className="27 fill-key-dark"
              d="M321.08,5.31V339.65h42.6V5.5Z"
            />
            <path
              id="28"
              data-name="28"
              className="28 fill-key"
              d="M369.7,1.3V346.89H335.28V519l7.74,4.47h65.41l7.42-4.28V1.3Z"
            />
            <path
              id="29"
              data-name="29"
              className="29 fill-key"
              d="M419.46,1.3V518.62l8.35,4.82h65.35l6.81-3.93V347.16H462.63V1.3Z"
            />
            <path
              id="30"
              data-name="30"
              className="30 fill-key-dark"
              d="M467.82,5.31V339.65h42.6V5.5Z"
            />
            <path
              id="31"
              data-name="31"
              className="31 fill-key"
              d="M515.48,1.3V346.76H503.65v172.4l6.82,3.94h66.2l6.7-3.87V346.75h-25V1.29Z"
            />
            <path
              id="32"
              data-name="32"
              className="32 fill-key-dark"
              d="M563.57,5.31V339.65h42.6V5.5Z"
            />
            <path
              id="33"
              data-name="33"
              className="33 fill-key"
              d="M611.36,1.3V346.89H587.83v172l7.87,4.55h65.69l7.08-4.1V346.62H654.26V1.3Z"
            />
            <path
              id="34"
              data-name="34"
              className="34 fill-key-dark"
              d="M659.32,5.31V339.65h42.6V5.5Z"
            />
            <path
              id="35"
              data-name="35"
              className="35 fill-key"
              d="M707,1.3V346.89H670.81v172.4l7.48,4.32H744.1l7.23-4.17V1.3Z"
            />
            <path
              id="36"
              data-name="36"
              className="36 fill-key"
              d="M754.93,1.61h45.73V347h34.42V519.08l-6.47,3.74H761.39l-6.86-4Z"
            />
            <path
              id="37"
              data-name="37"
              className="37 fill-key-dark"
              d="M808.32,5.66V340h42.6V5.85Z"
            />
            <path
              id="38"
              data-name="38"
              className="38 fill-key"
              d="M856.44,1.1V346.85H838.19V518.77l7.56,4.37H911.6l6.9-4V346.66H900.76V1.1Z"
            />
            <path
              id="39"
              data-name="39"
              className="39 fill-key-dark"
              d="M908,5.11V339.45h42.6V5.3Z"
            />
            <path
              id="40"
              data-name="40"
              className="40 fill-key"
              d="M956.65,1.1V346.69H922.23V518.82l7.74,4.47h65.41l7.42-4.28V1.1Z"
            />
            <path
              id="41"
              data-name="41"
              className="41 fill-key"
              d="M1006.43,1.1V518.42l8.35,4.82h65.35l6.81-3.93V347H1049.6V1.1Z"
            />
            <path
              id="42"
              data-name="42"
              className="42 fill-key-dark"
              d="M1054.73,5.11V339.45h42.6V5.3Z"
            />
            <path
              id="43"
              data-name="43"
              className="43 fill-key"
              d="M1102.43,1.1V346.56H1090.6V519l6.82,3.94h66.2l6.7-3.87V346.55h-25V1.09Z"
            />
            <path
              id="44"
              data-name="44"
              className="44 fill-key-dark"
              d="M1150.53,5.11V339.45h42.6V5.3Z"
            />
            <path
              id="45"
              data-name="45"
              className="45 fill-key"
              d="M1198.33,1.1V346.69H1174.8v172l7.87,4.55h65.69l7.08-4.09V346.43h-14.21V1.11Z"
            />
            <path
              id="46"
              data-name="46"
              className="46 fill-key-dark"
              d="M1246.23,5.11V339.45h42.6V5.3Z"
            />
            <path
              id="47"
              data-name="47"
              className="47 fill-key"
              d="M1293.93,1.1V346.69h-36.17v172.4l7.48,4.32h65.81l7.23-4.17V1.1Z"
            />
            <path
              id="48"
              data-name="48"
              className="48 fill-key"
              d="M1341.23,1.92H1387V347.26h34.42V519.39l-6.47,3.74h-67.22l-6.86-4Z"
            />
            <path
              id="49"
              data-name="49"
              className="49 fill-key-dark"
              d="M1394.63,6V340.31h42.6V6.16Z"
            />
            <path
              id="50"
              data-name="50"
              className="50 fill-key"
              d="M1442.73,1.4V347.15h-18.25V519.07l7.56,4.37h65.85l6.9-4V347h-17.74V1.4Z"
            />
            <path
              id="51"
              data-name="51"
              className="51 fill-key-dark"
              d="M1494.33,5.41V339.75h42.6V5.6Z"
            />
            <path
              id="52"
              data-name="52"
              className="52 fill-key"
              d="M1542.93,1.4V347h-34.42V519.12l7.74,4.47h65.41l7.42-4.28V1.4Z"
            />
            <path
              id="53"
              data-name="53"
              className="53 fill-key"
              d="M1592.63,1.4V518.72l8.35,4.82h65.35l6.81-3.93V347.26H1635.8V1.4Z"
            />
            <path
              id="54"
              data-name="54"
              className="54 fill-key-dark"
              d="M1641,5.41V339.75h42.6V5.6Z"
            />
            <path
              id="55"
              data-name="55"
              className="55 fill-key"
              d="M1688.73,1.4V346.86H1676.9v172.4l6.82,3.94h66.2l6.7-3.87V346.85h-25V1.39Z"
            />
            <path
              id="56"
              data-name="56"
              className="56 fill-key-dark"
              d="M1736.83,5.41V339.75h42.6V5.6Z"
            />
            <path
              id="57"
              data-name="57"
              className="57 fill-key"
              d="M1784.53,1.4V347H1761V519l7.87,4.55h65.69l7.08-4.1V346.72h-14.21V1.4Z"
            />
            <path
              id="58"
              data-name="58"
              className="58 fill-key-dark"
              d="M1832.53,5.41V339.75h42.6V5.6Z"
            />
            <path
              id="59"
              data-name="59"
              className="59 fill-key"
              d="M1880.23,1.4V347h-36.17v172.4l7.48,4.32h65.81l7.23-4.17V1.4Z"
            />
            <path
              id="60"
              data-name="60"
              className="60 fill-key"
              d="M1928.13,1.71h45.73V347.05h34.42V519.18l-6.47,3.74h-67.22l-6.87-4Z"
            />
            <path
              id="61"
              data-name="61"
              className="61 fill-key-dark"
              d="M1981.53,5.76V340.1h42.6V6Z"
            />
            <path
              id="62"
              data-name="62"
              className="62 fill-key"
              d="M2029.63,1.2V347h-18.25V518.87l7.56,4.37h65.85l6.9-4V346.76H2074V1.2Z"
            />
            <path
              id="63"
              data-name="63"
              className="63 fill-key-dark"
              d="M2081.23,5.21V339.55h42.6V5.4Z"
            />
            <path
              id="64"
              data-name="64"
              className="64 fill-key"
              d="M2129.83,1.2V346.79h-34.42V518.92l7.74,4.47h65.41l7.42-4.28V1.2Z"
            />
            <path
              id="65"
              data-name="65"
              className="65 fill-key"
              d="M2179.63,1.2V518.52l8.35,4.82h65.35l6.81-3.93V347.06H2222.8V1.2Z"
            />
            <path
              id="66"
              data-name="66"
              className="66 fill-key-dark"
              d="M2227.93,5.21V339.55h42.6V5.4Z"
            />
            <path
              id="67"
              data-name="67"
              className="67 fill-key"
              d="M2275.63,1.2V346.66H2263.8v172.4l6.82,3.94h66.2l6.7-3.87V346.65h-25V1.19Z"
            />
            <path
              id="68"
              data-name="68"
              className="68 fill-key-dark"
              d="M2323.73,5.19V338.13h42.43V5.38Z"
            />
            <path
              id="69"
              data-name="69"
              className="69 fill-key"
              d="M2371.33,1.19V345.33H2347.9V516.61l7.84,4.53h65.41l7.06-4.08v-172h-14.16V1.19Z"
            />
            <path
              id="70"
              data-name="70"
              className="70 fill-key-dark"
              d="M2419,5.19V338.13h42.43V5.38Z"
            />
            <path
              id="71"
              data-name="71"
              className="71 fill-key"
              d="M2466.53,1.19V345.33h-36V517l7.45,4.3h65.53l7.21-4.15V1.19Z"
            />
            <path
              id="72"
              data-name="72"
              className="72 fill-key"
              d="M2513.33,1.25h45.53v343.9h34.29V516.56l-6.45,3.72h-66.94l-6.83-3.94Z"
            />
            <path
              id="73"
              data-name="73"
              className="73 fill-key-dark"
              d="M2566.43,5.28V338.22h42.43V5.47Z"
            />
            <path
              id="74"
              data-name="74"
              className="74 fill-key"
              d="M2614.33.74V345h-18.18v171.2l7.53,4.35h65.58l6.87-4V344.85h-17.67V.74Z"
            />
            <path
              id="75"
              data-name="75"
              className="75 fill-key-dark"
              d="M2665.73,4.74V337.68h42.43V4.93Z"
            />
            <path
              id="76"
              data-name="76"
              className="76 fill-key"
              d="M2714.13.74V344.88h-34.28V516.29l7.71,4.45h65.14l7.38-4.26V.73Z"
            />
            <path
              id="77"
              data-name="77"
              className="77 fill-key"
              d="M2763.73.74V515.89l8.32,4.8h65.07l6.78-3.92V345.14h-37.18V.73Z"
            />
            <path
              id="78"
              data-name="78"
              className="78 fill-key-dark"
              d="M2811.83,4.74V337.68h42.43V4.93Z"
            />
            <path
              id="79"
              data-name="79"
              className="79 fill-key"
              d="M2859.33.74v344h-11.78V516.43l6.79,3.92h65.93l6.66-3.85V344.75h-24.88V.74Z"
            />
            <path
              id="80"
              data-name="80"
              className="80 fill-key-dark"
              d="M2907.23,4.74V337.68h42.43V4.93Z"
            />
            <path
              id="81"
              data-name="81"
              className="81 fill-key"
              d="M2954.83.74V344.88H2931.4V516.16l7.84,4.53h65.41l7.06-4.08v-172h-14.16V.74Z"
            />
            <path
              id="82"
              data-name="82"
              className="82 fill-key-dark"
              d="M3002.53,4.74V337.68H3045V4.93Z"
            />
            <path
              id="83"
              data-name="83"
              className="83 fill-key"
              d="M3050,.74V344.88h-36V516.56l7.45,4.3H3087l7.21-4.16V.74Z"
            />
            <path
              id="84"
              data-name="84"
              className="84 fill-key"
              d="M3097.73,1.05h45.54V345h34.28V516.36l-6.45,3.72h-66.94l-6.83-3.94Z"
            />
            <path
              id="85"
              data-name="85"
              className="85 fill-key-dark"
              d="M3150.93,5.08V338h42.43V5.27Z"
            />
            <path
              id="86"
              data-name="86"
              className="86 fill-key"
              d="M3198.83.54v344.3h-18.18V516l7.53,4.35h65.58l6.87-4V344.65H3243V.54Z"
            />
            <path
              id="87"
              data-name="87"
              className="87 fill-key-dark"
              d="M3250.23,4.53V337.47h42.43V4.72Z"
            />
            <path
              id="88"
              data-name="88"
              className="88 fill-key"
              d="M3298.63.54V344.68h-34.28V516.09l7.71,4.45h65.14l7.38-4.26V.53Z"
            />
            <path
              id="89"
              data-name="89"
              className="89 fill-key"
              d="M3348.23.54V515.69l8.32,4.8h65.07l6.78-3.92V344.94h-37.18V.53Z"
            />
            <path
              id="90"
              data-name="90"
              className="90 fill-key-dark"
              d="M3396.33,4.53V337.47h42.43V4.72Z"
            />
            <path
              id="91"
              data-name="91"
              className="91 fill-key"
              d="M3443.83.54v344h-11.78V516.23l6.79,3.92h65.93l6.66-3.85V344.55h-24.88V.54Z"
            />
            <path
              id="92"
              data-name="92"
              className="92 fill-key-dark"
              d="M3491.73,4.53V337.47h42.43V4.72Z"
            />
            <path
              id="93"
              data-name="93"
              className="93 fill-key"
              d="M3539.33.54V344.68H3515.9V516l7.84,4.53h65.41l7.06-4.08v-172h-14.16V.54Z"
            />
            <path
              id="94"
              data-name="94"
              className="94 fill-key-dark"
              d="M3587,4.53V337.47h42.43V4.72Z"
            />
            <path
              id="95"
              data-name="95"
              className="95 fill-key"
              d="M3634.53.54V344.68h-36V516.36l7.45,4.3h65.53l7.21-4.16V.53Z"
            />
            <path
              id="96"
              data-name="96"
              className="96 fill-key"
              d="M3681.53,1.35h45.53v343.9h34.29V516.66l-6.45,3.72H3688l-6.83-3.94Z"
            />
            <path
              id="97"
              data-name="97"
              className="97 fill-key-dark"
              d="M3734.73,5.39V338.33h42.43V5.58Z"
            />
            <path
              id="98"
              data-name="98"
              className="98 fill-key"
              d="M3782.63.84v344.3h-18.18v171.2l7.53,4.35h65.58l6.87-4V345h-17.67V.84Z"
            />
            <path
              id="99"
              data-name="99"
              className="99 fill-key-dark"
              d="M3834,4.84V337.78h42.43V5Z"
            />
            <path
              id="100"
              data-name="100"
              className="100 fill-key"
              d="M3882.43.84V345h-34.28V516.39l7.71,4.45H3921l7.38-4.26V.83Z"
            />
            <path
              id="101"
              data-name="101"
              className="101 fill-key"
              d="M3932,.84V516l8.32,4.8h65.07l6.78-3.92V345.24H3975V.83Z"
            />
            <path
              id="102"
              data-name="102"
              className="102 fill-key-dark"
              d="M3980.13,4.84V337.78h42.43V5Z"
            />
            <path
              id="103"
              data-name="103"
              className="103 fill-key"
              d="M4027.63.84v344h-11.78V516.53l6.79,3.92h65.93l6.66-3.85V344.85h-24.88V.84Z"
            />
            <path
              id="104"
              data-name="104"
              className="104 fill-key-dark"
              d="M4075.53,4.84V337.78H4118V5Z"
            />
            <path
              id="105"
              data-name="105"
              className="105 fill-key"
              d="M4123.13.84V345H4099.7V516.26l7.84,4.53H4173l7.06-4.08v-172h-14.16V.84Z"
            />
            <path
              id="106"
              data-name="106"
              className="106 fill-key-dark"
              d="M4170.83,4.84V337.78h42.43V5Z"
            />
            <path
              id="107"
              data-name="107"
              className="107 fill-key"
              d="M4218.33.84V345h-36V516.66l7.45,4.3h65.53l7.21-4.15V.84Z"
            />
            <path
              id="108"
              data-name="108"
              className="108 fill-key"
              d="M4266,1.15h79.82V516.46l-6.45,3.72h-66.94l-6.83-3.94Z"
            />
          </g>
        </svg>
      </div>
    </Suspense>
  );
};

export default PianoRoll;
