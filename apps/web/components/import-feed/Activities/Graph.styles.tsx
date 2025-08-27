import { colors } from '@config';
import { css, Global } from '@emotion/react';

export function ActivityGraphGlobalStyles({ isTriggerSent }: { isTriggerSent: boolean }) {
  return <Global styles={chartStyles(isTriggerSent)} />;
}

function chartStyles(isTriggerSent: boolean) {
  return css`
    #chart-bar-styles {
      height: 175px;
      filter: ${isTriggerSent ? 'none' : 'blur(4px)'};
      pointer-events: ${isTriggerSent ? 'auto' : 'none'};
    }

    #chartjs-tooltip {
      display: flex;
      justify-content: center;
      box-shadow: 0 5px 15px rgba(38, 68, 128, 0.05);
      background: ${colors.BGSecondaryDark};
      border-radius: 7px;
      padding: 12px 15px 14px 15px;
      pointer-events: none;
      position: absolute;
      z-index: 1;

      &:after {
        display: inline-block;
        bottom: -9px;
        content: '';
        position: absolute;
        left: calc(50% - 5px);
        border-top: 10px solid ${colors.BGSecondaryDark};
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
      }
    }

    .tooltip-title {
      display: flex;

      justify-content: center;
      height: 17px;
      margin-bottom: 4px;
      border-width: 22px;
      color: ${colors.black};
    }

    .tooltip-body {
      position: static;
      display: flex;
      justify-content: center;
      font-weight: 700;

      height: 17px;
      border-width: 22px;

      color: #ff512f;
      background: -webkit-linear-gradient(90deg, #dd2476 0%, #ff512f 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  `;
}
