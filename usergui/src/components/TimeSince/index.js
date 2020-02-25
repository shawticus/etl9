// @flow

import React, { useState, useEffect } from "react"
import moment from "moment"

export const TimeSince = ({ sinceTime }) => {
  const computeDuration = () => {
    const d = moment.duration(
      moment.utc().valueOf() - moment(sinceTime).valueOf()
    )
    const [days, h, m, s] = [d.days(), d.hours(), d.minutes(), d.seconds()]
    if (h > 0)
      return `${days ? `${days}d ` : ""}${h}h ${m
        .toString()
        .padStart(2, "0")}m ${s.toString().padStart(2, "0")}s`
    if (m > 0) return `${m}:${s.toString().padStart(2, "0")}`
    return `${s}s`
  }
  const [duration, changeDuration] = useState(computeDuration)

  useEffect(() => {
    const interval = setInterval(() => {
      changeDuration(computeDuration())
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  return duration
}

export default TimeSince
