import React from "react";
import CounterButton from "./CounterButton";

export default function GuestsDropdown({
  rooms,
  adults,
  children,
  setRooms,
  setAdults,
  setChildren,
  minRooms = 1,
  maxRooms = 9,
  minAdults = 1,
  maxAdults = 6,
  minChildren = 0,
  maxChildren = 6,
}) {
  const Row = ({ label, value, dec, inc, canDec, canInc }) => (
    <div className="counter-row">
      <div className="counter-label">{label}</div>
      <div className="d-flex align-items-center gap-2">
        <CounterButton
          kind="minus"
          muted={!canDec}
          disabled={!canDec}
          aria-label={`decrease ${label}`}
          onClick={dec}
        />
        <span className="counter-value">{value}</span>
        <CounterButton
          kind="plus"
          muted={!canInc}
          disabled={!canInc}
          aria-label={`increase ${label}`}
          onClick={inc}
        />
      </div>
    </div>
  );

  return (
    <div className="p-3" role="dialog" aria-label="Rooms and guests">
      <div className="mb-2 fw-semibold">Rooms</div>
      <Row
        label="Rooms"
        value={rooms}
        dec={() => setRooms(Math.max(minRooms, rooms - 1))}
        inc={() => setRooms(Math.min(maxRooms, rooms + 1))}
        canDec={rooms > minRooms}
        canInc={rooms < maxRooms}
      />

      <div className="mt-3 mb-2 small text-muted">Room 1 of {rooms}</div>
      <Row
        label="Adults"
        value={adults}
        dec={() => setAdults(Math.max(minAdults, adults - 1))}
        inc={() => setAdults(Math.min(maxAdults, adults + 1))}
        canDec={adults > minAdults}
        canInc={adults < maxAdults}
      />
      <Row
        label="Children"
        value={children}
        dec={() => setChildren(Math.max(minChildren, children - 1))}
        inc={() => setChildren(Math.min(maxChildren, children + 1))}
        canDec={children > minChildren}
        canInc={children < maxChildren}
      />
    </div>
  );
}
