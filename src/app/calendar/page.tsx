"use client";
import AppLayout from "@/components/layout/AppLayout";

import React, {
  Fragment,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import moment from "moment";
// import { OHLCData } from "@/lib/types";

import { Calendar, dateFnsLocalizer, Event } from "react-big-calendar";
// import {rbc-timeslot-group} from "./rbc"
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  CalendarApi,
  DailyOHLC,
  EventSchemaOutput,
  CustomCalendarData,
} from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import { title } from "process";
import Image from "next/image";
import {
  addHours,
  format,
  getDay,
  isThursday,
  isWednesday,
  startOfHour,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { enUS } from "date-fns/locale";
import { parse } from "url";

const CalendarPage = () => {
  const locales = {
    "en-US": enUS,
  };
  const endOfHour = (date: Date): Date => addHours(startOfHour(date), 1);
  const now = new Date();
  const today = new Date();
  const start = endOfHour(now);
  const end = addHours(start, 2);
  const [firstDayOfMonth, setFirstDayOfMonth] = useState(startOfMonth(today));

  const onNavigate = useCallback(
    (newDate: Date) => {
      setFirstDayOfMonth(startOfMonth(newDate));
    },
    [setFirstDayOfMonth]
  );
  // console.log("first day", firstDayOfMonth, firstDayOfMonth.getMonth());
  // The types here are `object`. Strongly consider making them better as removing `locales` caused a fatal error
  const indices = ["NIFTY", "BANKNIFTY", "FINNIFTY", "INDIAVIX"];
  const [indice, setIndice] = useState("NIFTY");
  const indiceOnClick = useCallback(
    (value: any) => {
      // really better to useReducer for simultaneously setting multiple state values
      setValues((prevData) => ({
        ...prevData,
        loading: true,
        dataLoading: true,
      }));
      setIndice(value);
      getOHLCData(value);
      // setRightToLeft(value === 'BANKNIFTY')
    },
    [setIndice]
  );
  // console.log('indice', indice)
  const [selectedInfo, setSelectedInfo] = useState({
    data: [] as CustomCalendarData[],
  });

  const [eventInfo, setEventInfo] = useState({
    data: [] as EventSchemaOutput[],
  });

  const [values, setValues] = useState({
    loading: true,
    dataLoading: true,
  });
  const formatToSimpleDateWithSeconds = (
    date: Date | string | null | undefined
  ) =>
    date !== null && date !== undefined
      ? format(new Date(date), "yyyy-MM-dd HH:mm:ss")
      : undefined;

  const getEventData = async (indice: any) => {
    const calendarApi = new CalendarApi(baseConfig());
    setValues((prevData) => ({
      ...prevData,
      loading: true,
      dataLoading: true,
    }));
    const ohlcData = await calendarApi.dailyEventsV1CalendarDailyEventsGet(
      formatToSimpleDateWithSeconds(
        new Date(new Date().setDate(now.getDate() - 360))
      ),
      formatToSimpleDateWithSeconds(now)
    );
    // console.log('api response', ohlcData.data);
    // setSelectedInfo<OHLCData>(ohlcData.data);
    setEventInfo((prevData) => ({
      ...prevData,
      data: ohlcData.data,
    }));
    // console.log('selected info',selectedInfo)
    // set loading
    setValues((prevData) => ({
      ...prevData,
      loading: false,
      dataLoading: false,
    }));
  };

  const getOHLCData = async (indice: any) => {
    const calendarApi = new CalendarApi(baseConfig());
    setValues((prevData) => ({
      ...prevData,
      loading: true,
      dataLoading: true,
    }));
    console.log(
      "Start Date",
      new Date(new Date().setDate(now.getDate() - 180))
    );
    const ohlcData =
      await calendarApi.getCustomOhlcDataV1CalendarCustomOhlcDataGet(
        indice,
        "",
        formatToSimpleDateWithSeconds(
          new Date(new Date().setDate(now.getDate() - 360))
        )
      );
    // console.log("api response", ohlcData.data);
    // setSelectedInfo<OHLCData>(ohlcData.data);
    setSelectedInfo((prevData) => ({
      ...prevData,
      data: ohlcData.data,
    }));
    getEventData(indice);
    // console.log('selected info',selectedInfo)
    // set loading
    setValues((prevData) => ({
      ...prevData,
      loading: false,
      dataLoading: false,
    }));
  };

  const eventPropGetter = useCallback(
    (event: any, start: any, end: any, isSelected: boolean) => ({
      ...(isSelected && {
        style: {
          backgroundColor: "#0f0f0f",
        },
      }),
      // ...(moment(start).hour() < 12 && {
      //   className: 'powderBlue',
      // }),
      ...(event.title < 0 && {
        style: {
          backgroundColor: "red",
        },
      }),
      ...(event.title > 0 && {
        style: {
          backgroundColor: "green",
        },
      }),
    }),
    []
  );

  const dayPropGetter = useCallback(
    (date: Date) => ({
      ...(isThursday(date) &&
        (indice == "NIFTY" || indice == "BANKNIFTY") && {
          style: {
            backgroundColor: "lightblue",
            color: "white",
          },
        }),
      ...(isWednesday(date) &&
        indice == "FINNIFTY" && {
          style: {
            backgroundColor: "lightblue",
            color: "white",
          },
        }),
      ...(date.toDateString() == today.toDateString() && {
        style: {
          backgroundColor: "lightgreen",
          color: "blue",
        },
      }),
    }),
    []
  );
  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
  });

  const ColoredDateCellWrapper = (children: any) =>
    React.cloneElement(React.Children.only(children), {
      style: {
        backgroundColor: "green",
      },
    });
  const backgroundEvents = [
    {
      id: 0,
      title: "NIFTY / BANKNIFTY Expiry Day",
      start,
      end,
    },
  ];

  const events =
    selectedInfo.data &&
    selectedInfo.data.map((data) => ({
      title: data.title, //(data.close - data.open).toFixed(2),
      start: data.start,
      end: data.end,
      allDay: data.allDay,
    }));

  const newEvents =
    eventInfo.data &&
    eventInfo.data.map((data) => ({
      title: data.name,
      start: data.event_date,
      end: data.event_date,
      allDay: true,
    }));

  const updatedEventsArray = events.concat(newEvents);
  // console.log("events info", updatedEventsArray);

  useEffect(() => {
    getOHLCData(indice);
  }, []);

  const { components } = useMemo(
    () => ({
      components: {
        daySlotWrapper: ColoredDateCellWrapper,
        timeSlotWrapper: ColoredDateCellWrapper,
      },
    }),
    []
  );
  const svg_data = (data: any) => {
    if (data.title > 0) {
      return "/svg/top-arrow-icon.svg";
    } else if (data.title < 0) {
      return "/svg/bottom-arrow-icon.svg";
    }
    return "/svg/simulator.svg";
  };
  const MonthEvent = (event: any) => (
    <div className="flex flex-row items-center justify-center">
      <Image src={svg_data(event)} height={12} width={12} alt={""} /> &nbsp;
      <div className="items-center justify-start">{event.title}</div>
    </div>
  );

  return (
    <AppLayout>
      <Fragment>
        <div className="text-green flex h-[calc(100vh-8rem)] w-full flex-col">
          <div className="text-green flex justify-end p-2">
            <select
              className="form-control"
              defaultValue={"NIFTY"}
              onChange={(e) => indiceOnClick(e.target.value)}
            >
              {indices.map((c, idx) => (
                <option className="p-3 text-cyan-400" key={idx} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <Calendar
            // components={components}
            components={{
              event: MonthEvent,
            }}
            dayPropGetter={dayPropGetter}
            // indice={indice}
            backgroundEvents={backgroundEvents}
            localizer={localizer}
            views={["month"]}
            events={updatedEventsArray}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 800 }}
            eventPropGetter={eventPropGetter}
            onNavigate={onNavigate}
            className="text-medium h-screen w-full"
            popup
          />
        </div>
      </Fragment>
    </AppLayout>
  );
};

export default CalendarPage;
