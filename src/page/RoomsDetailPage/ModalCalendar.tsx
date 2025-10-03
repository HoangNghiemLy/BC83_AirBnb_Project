import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsModalCalendarOpen,
  setNgayDen,
  setNgayDi,
  setTotalDay,
} from "../../store/slices/bookingSlice";
import { Modal } from "antd";
import { DateRange } from "react-date-range";
import type { RangeKeyDict } from "react-date-range";
import { vi } from "date-fns/locale";
import { addDays } from "date-fns";
import type { RootState, AppDispatch } from "../../store/store";
import type { Range } from "react-date-range";

export default function ModalCalendar() {
  const { totalDay, isModalCalendarOpen, ngayDen, ngayDi } = useSelector(
    (state: RootState) => state.bookingSlice
  );
  const dispatch = useDispatch<AppDispatch>();

  //   const [dateRange, setDateRange] = useState<Range[]>([
  //     {
  //       startDate: ngayDen,
  //       endDate: ngayDi,
  //       key: "selection",
  //     },
  //   ]);
  const [dateRange, setDateRange] = useState<Range[]>([
    {
      startDate: typeof ngayDen === "string" ? new Date(ngayDen) : ngayDen,
      endDate: typeof ngayDi === "string" ? new Date(ngayDi) : ngayDi,
      key: "selection",
    },
  ]);

  const onchangeDate = (item: RangeKeyDict) => {
    const { startDate, endDate } = item.selection;
    if (startDate && endDate) {
      setDateRange([item.selection]);
      // dispatch(setNgayDen(startDate));
      // dispatch(setNgayDi(endDate));
      dispatch(setNgayDen(startDate.toISOString()));
      dispatch(setNgayDi(endDate.toISOString()));
      const days = Math.round(
        (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
      );
      dispatch(setTotalDay(days));
    }
  };

  const handleOk = () => {
    dispatch(setIsModalCalendarOpen(false));
  };

  const handleCancel = () => {
    dispatch(setIsModalCalendarOpen(false));
  };

  return (
    <Modal
      title={`${totalDay} đêm`}
      open={isModalCalendarOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
    >
      <DateRange
        className="w-full"
        onChange={onchangeDate}
        // showSelectionPreview={true}
        moveRangeOnFirstSelection={false}
        months={1}
        rangeColors={["rgb(254, 107, 110)"]}
        ranges={dateRange}
        minDate={new Date()}
        locale={vi}
        maxDate={addDays(new Date(), 180)}
      />
    </Modal>
  );
}
