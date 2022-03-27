import styled from 'styled-components'

const TimeDisplay = styled.div`
  position: relative;
  width: 100%;
  max-width: 450px;
  svg {
    max-width: 450px;
  }
  circle {
    transition: stroke-dashoffset 1s;
    transform: rotate(-90deg);
    transform-origin: 50% 50%;
  }
  > div {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -60px);
    text-align: center;
  }
  h1 {
    font-size: 80px;
    font-weight: 500;
    color: '#000000';
    letter-spacing: 2px;
    margin: 0;
  }
  p {
    font-size: 14px;
    text-transform: uppercase;
    color: #bbb;
    letter-spacing: 3px;
    margin: 10px 0 0;
  }
`

interface UserTimerDisplayProps {
  time: any
  status: any
  progress: any
}

function UserTimerDisplay({ time, status, progress }: UserTimerDisplayProps) {
  const pad2 = (num: any) => {
    return num > 9 ? num : `0${num}`
  }

  const formatTime = (time: any) => {
    const minutes = pad2(Math.floor(time / 60))
    const seconds = pad2(Math.floor(time % 60))

    return `${minutes}:${seconds}`
  }

  document.title = `(${formatTime(time)}) docong`

  const radius = 225
  const stroke = 7
  const normalizedRadius = radius - stroke * 2
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <TimeDisplay>
      <svg width="100%" viewBox={`0 0 ${radius * 2} ${radius * 2}`}>
        <circle
          stroke="#455A47"
          fill="#fff"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="#ddd"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div>
        <h1>{formatTime(time)}</h1>
        <p>{status}</p>
      </div>
    </TimeDisplay>
  )
}

export default UserTimerDisplay
