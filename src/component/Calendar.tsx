import React, { useMemo, useState } from "react";
import classNames from "classnames";
import { Calendar as AntCalendar, Col, Radio, Row } from "antd";
import type { Moment } from "moment";
import { moment } from "obsidian";
import "moment/locale/zh-cn";
import type { CalendarProps } from "antd";
import { createStyles } from "antd-style";
import {
  DoubleLeftOutlined,
  DoubleRightOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { useAppSelector } from "../redux/hook";
import {
  formatLabel,
  formatDate,
  formatMonth,
  noteIsExists,
  openOrCreateNote,
} from "../redux/notes";
import { NoteType } from "../enum";

// 配置antd使用Moment
import momentGenerateConfig from "rc-picker/es/generate/moment";
const MyAntCalendar =
  AntCalendar.generateCalendar<Moment>(momentGenerateConfig);
// 配置中文
moment.locale("zh-cn", {
  week: {
    dow: 1,
  },
});

const useStyle = createStyles(({ token, css, cx }) => {
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
  return {
    wrapper: css`
      min-width: 368px;
      border-radius: ${token.borderRadiusOuter};
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
    `,
    header: css`
      border-bottom: var(--divider-width) solid var(--divider-color);
    `,
    icon: css`
      cursor: pointer;
    `,
    flexCenter: css`
      display: flex;
      align-items: center;
      justify-content: center;
    `,
    headerDate: css`
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
            bottom: 0px;
          }
        }
      }
    `,
    content: css`
      display: flex;
      & .ant-picker-calendar .ant-picker-content th {
        color: var(--text-normal);
      }
    `,
    extraW: css`
      padding: 8px 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-right: 4px;
      border-right: var(--divider-width) solid var(--divider-color);
    `,
    extraQ: css`
      padding: 8px 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
      border-right: var(--divider-width) solid var(--divider-color);
    `,
    extraWTh: css`
      line-height: 18px;
      width: 40px;
      font-size: 14px;
    `,
    extraWTd: css`
      font-weight: normal;
      margin: 6px !important;
      margin-left: 0 !important;
      &.${cx(exist)} {
        &:after {
          top: 36px;
          left: 50%;
        }
      }
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
    dateCell: css`
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
    `,
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
    radio: css`
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
    `,
  };
});

const Calendar: React.FC<{}> = ({}) => {
  const { styles } = useStyle({ test: true });

  const notes = useAppSelector((state) => state.notes);

  const [selectDate, setSelectDate] = React.useState<Moment>(moment());
  const onDateChange: CalendarProps<Moment>["onSelect"] = (
    date,
    selectInfo
  ) => {
    if (selectInfo.source === "date") {
      return;
    }
    setSelectDate(date);
  };

  const [mode, setMode] = useState<CalendarProps<Moment>["mode"]>("month");
  const changeMode = (mode: CalendarProps<Moment>["mode"] & "today") => {
    if (mode === "today") {
      setSelectDate(moment());
      return;
    }
    setMode(mode);
  };

  const cellRender: CalendarProps<Moment>["fullCellRender"] = (date, info) => {
    if (info.type === "date") {
      const { dateStr, isWork, isHoliday } = formatDate(date);
      const today = date.isSame(moment(), "date");
      return React.cloneElement(info.originNode, {
        ...info.originNode.props,
        className: classNames(styles.dateCell, {
          [styles.today]: today,
          [styles.holiday]: isHoliday && !isWork,
          [styles.work]: isWork,
          [styles.week]: (date.day() === 0 || date.day() === 6) && !isWork,
          [styles.exist]: noteIsExists(
            date,
            NoteType.DAILY,
            notes[NoteType.DAILY]
          ),
        }),
        children: (
          <div
            className={styles.text}
            onClick={() =>
              openOrCreateNote(date, NoteType.DAILY, notes[NoteType.DAILY])
            }
          >
            {date.get("date")}
            {info.type === "date" && (
              <div className={styles.lunar}>{dateStr}</div>
            )}
            {today && <div className={styles.badge}>今</div>}
            {isHoliday && !isWork && <div className={styles.badge}>休</div>}
            {isWork && <div className={styles.badge}>班</div>}
          </div>
        ),
      });
    }

    if (info.type === "month") {
      // Due to the fact that a solar month is part of the lunar month X and part of the lunar month X+1,
      // when rendering a month, always take X as the lunar month of the month
      const month = formatMonth(date);
      return (
        <div
          className={classNames(styles.monthCell, {
            [styles.monthCellCurrent]: date.isSame(moment(), "month"),
            [styles.exist]: noteIsExists(
              date,
              NoteType.MONTHLY,
              notes[NoteType.MONTHLY]
            ),
          })}
          onClick={() =>
            openOrCreateNote(date, NoteType.MONTHLY, notes[NoteType.MONTHLY])
          }
        >
          {date.get("month") + 1}月（{month}月）
        </div>
      );
    }
  };

  const changeDate = (
    option: string,
    unit: moment.unitOfTime.DurationConstructor
  ) => {
    let newDate = selectDate.clone();
    if (option === "add") {
      newDate = newDate.add(1, unit);
    } else {
      newDate = newDate.subtract(1, unit);
    }
    setSelectDate(newDate);
  };

  const yearLabel = useMemo(
    () => `${selectDate.format("YYYY")}年`,
    [selectDate]
  );
  const monthlabel = useMemo(
    () => `${selectDate.format("MM")}月`,
    [selectDate]
  );
  const quarterLabel = useMemo(
    () => `第${selectDate.format("Q")}季度`,
    [selectDate]
  );

  const chineseLabel = useMemo(() => {
    return formatLabel(selectDate);
  }, [selectDate]);

  const weeksArr = useMemo(() => {
    const firstWeek = moment(`${selectDate.format("YYYY-MM")}-01`);
    return new Array(6)
      .fill(firstWeek)
      .map<Moment>((v, idx) => v.clone().add(idx, "w"))
      .map((v) => {
        let week = v.week();
        return (
          <div
            key={week}
            className={classNames(
              styles.extraWTd,
              styles.flexCenter,
              styles.dateCell,
              {
                [styles.exist]: noteIsExists(
                  v,
                  NoteType.WEEKLY,
                  notes[NoteType.WEEKLY]
                ),
              }
            )}
            onClick={() =>
              openOrCreateNote(v, NoteType.WEEKLY, notes[NoteType.WEEKLY])
            }
          >
            {week}
          </div>
        );
      });
  }, [selectDate, notes]);

  const quartersArr = useMemo(() => {
    const firstQuarter = moment(`${selectDate.format("YYYY")}-01-01`);
    return new Array(4)
      .fill(firstQuarter)
      .map<Moment>((v, idx) => v.clone().add(idx, "Q"))
      .map((v) => {
        let quarter = v.quarter();
        return (
          <div
            key={quarter}
            className={classNames(
              styles.extraQTd,
              styles.flexCenter,
              styles.dateCell,
              {
                [styles.exist]: noteIsExists(
                  v,
                  NoteType.QUARTERLY,
                  notes[NoteType.QUARTERLY]
                ),
              }
            )}
            onClick={() =>
              openOrCreateNote(v, NoteType.QUARTERLY, notes[NoteType.QUARTERLY])
            }
          >
            第{["一", "二", "三", "四"][quarter - 1]}
            <div className={styles.text}>季度</div>
          </div>
        );
      });
  }, [selectDate, notes]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <Row justify="end" gutter={8}>
          <Col>
            <Radio.Group
              size="small"
              onChange={(e) =>
                changeMode(
                  e.target.value as CalendarProps<Moment>["mode"] & "today"
                )
              }
              className={styles.radio}
              value={mode}
            >
              <Radio.Button value="today">今</Radio.Button>
              <Radio.Button value="month">月</Radio.Button>
              <Radio.Button value="year">年</Radio.Button>
            </Radio.Group>
          </Col>
        </Row>
        <Row
          justify="center"
          style={{ margin: "4px 0" }}
          gutter={8}
          align="middle"
        >
          <Col>
            <DoubleLeftOutlined
              className={styles.icon}
              aria-label="前一年"
              title="前一年"
              onClick={() => changeDate("sub", "year")}
            />
          </Col>
          <Col>
            <LeftOutlined
              className={styles.icon}
              aria-label="前一月"
              title="前一月"
              onClick={() => changeDate("sub", "month")}
            />
          </Col>
          <Col flex="auto">
            <div className={classNames(styles.headerDate, styles.flexCenter)}>
              <div
                onClick={() =>
                  openOrCreateNote(
                    selectDate,
                    NoteType.YEARLY,
                    notes[NoteType.YEARLY]
                  )
                }
                className={classNames({
                  [styles.exist]: noteIsExists(
                    selectDate,
                    NoteType.YEARLY,
                    notes[NoteType.YEARLY]
                  ),
                })}
              >
                {yearLabel}
              </div>
              <div
                onClick={() =>
                  openOrCreateNote(
                    selectDate,
                    NoteType.MONTHLY,
                    notes[NoteType.MONTHLY]
                  )
                }
                className={classNames({
                  [styles.exist]: noteIsExists(
                    selectDate,
                    NoteType.MONTHLY,
                    notes[NoteType.MONTHLY]
                  ),
                })}
              >
                {monthlabel}
              </div>
              <div
                onClick={() =>
                  openOrCreateNote(
                    selectDate,
                    NoteType.QUARTERLY,
                    notes[NoteType.QUARTERLY]
                  )
                }
                className={classNames({
                  [styles.exist]: noteIsExists(
                    selectDate,
                    NoteType.QUARTERLY,
                    notes[NoteType.QUARTERLY]
                  ),
                })}
              >
                {quarterLabel}
              </div>
            </div>
            <div className={classNames(styles.flexCenter)}>{chineseLabel}</div>
          </Col>
          <Col>
            <RightOutlined
              className={styles.icon}
              aria-label="后一月"
              title="后一月"
              onClick={() => changeDate("add", "month")}
            />
          </Col>
          <Col>
            <DoubleRightOutlined
              className={styles.icon}
              title="后一年"
              aria-label="后一年"
              onClick={() => changeDate("add", "year")}
            />
          </Col>
        </Row>
      </div>
      <div className={styles.content}>
        {mode === "month" ? (
          <div className={styles.extraW}>
            <div className={classNames(styles.extraWTh, styles.flexCenter)}>
              周
            </div>
            {weeksArr}
          </div>
        ) : (
          <div className={styles.extraQ}>{quartersArr}</div>
        )}
        <MyAntCalendar
          fullCellRender={cellRender}
          fullscreen={false}
          mode={mode}
          value={selectDate}
          onSelect={onDateChange}
          headerRender={() => null}
        />
      </div>
    </div>
  );
};

export default Calendar;
