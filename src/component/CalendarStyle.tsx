import { createStyles } from "antd-style";

export const useStyle = createStyles(({ token, css, cx }) => {
  const lunar = css`
    color: var(--text-normal);
    font-size: ${token.fontSizeSM}px;
  `;
  const exist = css`
    position: relative;
    &:after {
      position: absolute;
      z-index: 1;
      content: "";
      border-radius: 50%;
      background-color: var(--text-accent);
      transform: translateX(-50%);
      left: 50%;
      top: 42px;
      width: 4px;
      height: 4px;
    }
  `;
  const badge = css`
    position: absolute;
    right: -8px;
    top: -8px;
    font-size: 12px;
    border-radius: 4px;
    color: #fff;
    padding: 0px 3px;
  `;

  const dateCell = css`
    width: 42px;
    height: 42px;
    border-radius: ${token.borderRadiusOuter}px;
    box-sizing: border-box;
    transition: background 300ms;
    background: transparent;
    margin: 0 auto;
    border-radius: 4px;
    color: var(--text-normal);
    &:hover {
      background: var(--nav-item-background-hover);
    }
  `;

  const headerDate = css`
    display: flex;
    font-size: 20px;
    div {
      margin: 0 2px;
      padding: 2px 4px;
      cursor: pointer;
      border-radius: ${token.borderRadiusOuter}px;
      &:hover {
        background: var(--nav-item-background-hover);
      }
      &.${cx(exist)} {
        &:after {
          top: 26px;
        }
      }
    }
  `;

  const headerLunarDate = css`
    font-size: 14px;
  `;

  const radio = css`
    & .ant-radio-button-wrapper {
      color: var(--text-normal);
      background: transparent;
      border-color: var(--divider-color);
    }
    & .ant-radio-button-wrapper-checked {
      border-color: var(--text-accent);
    }
    & .ant-radio-button-wrapper:not(:first-child)::before {
      background-color: var(--divider-color);
    }
    & .ant-radio-button-wrapper-checked:not(:first-child)::before {
      background-color: var(--text-accent);
    }
  `;

  const wrapper = css`
    min-width: 368px;
    border-radius: ${token.borderRadiusOuter}px;
    padding: 5px;
    .ant-picker-calendar {
      .ant-picker-panel {
        border: none;
        .ant-picker-cell {
          opacity: 0.3;
        }
        .ant-picker-cell-in-view {
          opacity: 1;
        }
      }
    }
  `;

  const arrowIcon = css`
    cursor: pointer;
  `;

  const extraW = css`
    padding: 8px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 4px;
    border-right: var(--divider-width) solid var(--divider-color);
  `;

  const extraWTh = css`
    line-height: 18px;
    width: 40px;
    font-size: 14px;
  `;

  const extraWTd = css`
    font-weight: normal;
    margin: 6px !important;
    margin-left: 0 !important;
    &.${cx(exist)} {
      &:after {
        top: 36px;
        left: 50%;
      }
    }
  `;

  const small = css`
    min-width: 300px;
    padding: 0;

    & .ant-picker-cell,
    .ant-picker-cell-in-view {
      padding: 1px;
    }

    & .ant-picker-content {
      font-size: 12px;
    }

    & .ant-picker-calendar .ant-picker-body {
      padding: 2px 0;
    }

    & .${cx(dateCell)} {
      width: 36px;
      height: 40px;
      &.${cx(exist)} {
        &:after {
          top: 36px;
          left: 50%;
        }
      }
    }

    & .${cx(headerDate)} {
      font-size: 16px;
    }

    & .${cx(headerLunarDate)} {
      font-size: 12px;
    }

    & .${cx(radio)} .ant-radio-button-wrapper {
      font-size: 12px;
      height: 18px;
      line-height: 16px;
    }

    & .${cx(extraW)} {
      padding: 2px 0;
      margin-right: 1px;
      font-size: 12px;
    }

    & .${cx(extraWTh)} {
      width: 36px;
      font-size: 12px;
    }

    & .${cx(extraWTd)} {
      margin: 1px !important;
      &.${cx(exist)} {
        &:after {
          top: 30px;
          left: 50%;
        }
      }
    }

    & .${cx(arrowIcon)} {
      padding: 0;
    }
  `;
  return {
    wrapper,
    small,
    header: css`
      border-bottom: var(--divider-width) solid var(--divider-color);
    `,
    arrowIcon,
    flexCenter: css`
      display: flex;
      align-items: center;
      justify-content: center;
    `,
    headerDate,
    headerLunarDate,
    content: css`
      display: flex;
      & .ant-picker-calendar .ant-picker-content th {
        color: var(--text-normal);
      }
    `,
    extraW,
    extraWTh,
    extraWTd,
    extraQ: css`
      padding: 8px 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
      border-right: var(--divider-width) solid var(--divider-color);
    `,
    extraQTd: css`
      font-weight: normal;
      margin: 6px !important;
      margin-left: 0 !important;
      flex-direction: column;
      &.${cx(exist)} {
        &:after {
          top: 42px;
          left: 50%;
        }
      }
    `,
    dateCell,
    exist,
    lunar,
    text: css`
      position: relative;
      z-index: 1;
    `,
    today: css`
      border: 1px solid var(--text-accent);
      color: var(--text-accent);
      &:hover {
        color: var(--text-accent);
        background: var(--nav-item-background-hover);
        .${cx(lunar)} {
          color: var(--text-accent);
        }
      }
      .${cx(lunar)} {
        color: var(--text-accent);
      }
      & .${cx(badge)} {
        background: var(--text-accent);
      }
    `,
    week: css`
      color: var(--color-red);
      .${cx(lunar)} {
        color: var(--color-red);
      }
    `,
    holiday: css`
      color: var(--color-red);
      border: 1px solid var(--color-red);
      .${cx(lunar)} {
        color: var(--color-red);
      }
      & .${cx(badge)} {
        background: var(--color-red);
      }
    `,
    work: css`
      border: 1px solid var(--text-normal);
      & .${cx(badge)} {
        background: var(--text-normal);
        color: var(--background-primary);
      }
    `,
    badge,
    monthCell: css`
      width: 120px;
      color: var(--text-normal);
      border-radius: ${token.borderRadiusOuter}px;
      padding: 5px 0;
      &:hover {
        background: var(--nav-item-background-hover);
      }
      &.${cx(exist)} {
        &:after {
          top: 30px;
          left: 50%;
        }
      }
    `,
    monthCellCurrent: css`
      color: var(--text-accent) !important;
    `,
    radio,
  };
});
