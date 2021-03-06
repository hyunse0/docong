import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import Board, { moveCard } from '@asseinfo/react-kanban'
import '@asseinfo/react-kanban/dist/styles.css'
import { useDispatch, useSelector } from 'react-redux'
import { GroupTodo, GroupTodoInput } from '../../api/groupTodo'
import { RootState } from '../../modules'
import EditIcon from '@mui/icons-material/Edit'
import produce from 'immer'
import { changeUserTimerTodo } from '../../modules/user'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  SelectChangeEvent,
  Card,
  Typography,
  Chip,
  Avatar,
  Grid,
  DialogContentText,
  InputAdornment,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import { darken, lighten } from 'polished'
import '../user/UserTodo.scss'
import { modifyJiraInfoAsync } from '../../modules/group'
import { Group } from '../../api/group'
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown'
import CircleIcon from '@mui/icons-material/Circle'
import Api from '../../lib/customApi'
import { BASE_URL } from '../../api/auth'
import CircularProgress from '@mui/material/CircularProgress'

interface GroupTodoProps {
  group: Group | null
  groupSeq: number
  groupTodos: any
  createTodo: (groupTodoInput: GroupTodoInput) => void
  modifyTodo: (todoId: number, groupTodoInput: GroupTodoInput) => void
  deleteTodo: (todoId: any) => void
  modifyTodoStatus: (todoId: number, todoStatus: string) => void
  startTodoTimer: (selectedGroupTodo: GroupTodo) => void
}

function GroupTodoComponent({
  group,
  groupSeq,
  groupTodos,
  createTodo,
  modifyTodo,
  deleteTodo,
  modifyTodoStatus,
  startTodoTimer,
}: GroupTodoProps) {
  const [board, setBoard] = useState({
    columns: [
      {
        id: 0,
        title: '?????????',
        cards: [],
      },
      {
        id: 1,
        title: '??????',
        cards: [],
      },
      {
        id: 2,
        title: '?????????',
        cards: [],
      },
    ],
  })

  const userInfo = useSelector((state: RootState) => state.user.userInfo.data)
  const userTimer = useSelector((state: RootState) => state.user.userTimer)

  const [isOpenCreateTodo, setIsOpenCreateTodo] = useState(false)
  const [isOpenModifyTodo, setIsOpenModifyTodo] = useState(false)
  const [selectedDeleteTodo, setSelectedDeleteTodo] = useState(null)
  const [modifyTodoId, setModifyTodoId] = useState(0)
  const [selectedTodo, setSelectedTodo] = useState<null | GroupTodo>(null)
  const [isOpenJiraSettingForm, setIsOpenJiraSettingForm] = useState(false)

  const [groupTodoInput, setGroupTodoInput] = useState({
    title: '',
    content: '',
    predictedPomo: 1,
    teamId: groupSeq,
    userEmail: userInfo ? userInfo.email : '',
    workImportance: '???',
    workProficiency: '??????',
    workType: '??????',
  })

  const [jiraInfoInput, setJiraInfoInput] = useState({
    jiraAPIToken: group ? group.jiraApiToken : '',
    jiraDomain: group ? group.jiraDomain : '',
    jiraProjectKey: group ? group.jiraProjectKey : '',
    jiraUserId: group ? group.jiraUserId : '',
  })

  const dispatch = useDispatch()

  const workTypeColors = [
    '#ffc078',
    '#ffe066',
    '#c0eb75',
    '#8ce99a',
    '#63e6be',
    '#66d9e8',
    '#74c0fc',
    '#91a7ff',
    '#b197fc',
    '#e599f7',
    '#faa2c1',
    '#ffa8a8',
    '#ffd8a8',
    '#ffec99',
    '#d8f5a2',
    '#b2f2bb',
    '#ced4da',
  ]
  const workImportanceList = ['???', '??????', '???', '??????', '???']
  const workProficiencyList = ['??????', '?????????', '??????', '?????????', '??????']
  const workTypeList = [
    '??????',
    '??????',
    '?????????',
    '?????????',
    '??????',
    'QA',
    '??????',
    '??????',
    '??????',
    '??????',
    '??????',
    '??????',
    '??????',
    '?????????',
    '??????',
    '??????',
    '??????',
  ]
  const todoStatus = ['TODO', 'IN_PROGRESS', 'DONE']

  useEffect(() => {
    if (groupTodos !== null) {
      const todo = groupTodos
        .filter((groupTodo: GroupTodo) => groupTodo.status === 'TODO')
        .map((groupTodo: GroupTodo) => ({
          id: groupTodo.seq,
          title: groupTodo.title,
          content: groupTodo.content,
          workImportance: groupTodo.workImportance,
          workProficiency: groupTodo.workProficiency,
          workType: groupTodo.workType,
          predictedPomo: groupTodo.predictedPomo,
          realPomo: groupTodo.realPomo,
          status: groupTodo.status,
          userName: groupTodo.userName,
          userEmail: groupTodo.userEmail,
          userImg: groupTodo.userImg,
          activate: groupTodo.activate,
        }))
      const inProgress = groupTodos
        .filter((groupTodo: GroupTodo) => groupTodo.status === 'IN_PROGRESS')
        .map((groupTodo: GroupTodo) => ({
          id: groupTodo.seq,
          title: groupTodo.title,
          content: groupTodo.content,
          workImportance: groupTodo.workImportance,
          workProficiency: groupTodo.workProficiency,
          workType: groupTodo.workType,
          predictedPomo: groupTodo.predictedPomo,
          realPomo: groupTodo.realPomo,
          status: groupTodo.status,
          userName: groupTodo.userName,
          userEmail: groupTodo.userEmail,
          userImg: groupTodo.userImg,
          activate: groupTodo.activate,
        }))
      const done = groupTodos
        .filter((groupTodo: GroupTodo) => groupTodo.status === 'DONE')
        .map((groupTodo: GroupTodo) => ({
          id: groupTodo.seq,
          title: groupTodo.title,
          content: groupTodo.content,
          workImportance: groupTodo.workImportance,
          workProficiency: groupTodo.workProficiency,
          workType: groupTodo.workType,
          predictedPomo: groupTodo.predictedPomo,
          realPomo: groupTodo.realPomo,
          status: groupTodo.status,
          userName: groupTodo.userName,
          userEmail: groupTodo.userEmail,
          userImg: groupTodo.userImg,
          activate: groupTodo.activate,
        }))
      setBoard(
        produce((draft) => {
          draft.columns[0].cards = todo
          draft.columns[1].cards = inProgress
          draft.columns[2].cards = done
        })
      )
      if (userTimer.selectedTodo) {
        dispatch(
          changeUserTimerTodo(
            groupTodos.find(
              (groupTodo: GroupTodo) =>
                groupTodo.seq === userTimer.selectedTodo.seq
            )
          )
        )
      }
    }
  }, [groupTodos])

  useEffect(() => {
    if (isOpenJiraSettingForm === true) {
      setJiraInfoInput({
        jiraAPIToken: group ? group.jiraApiToken : '',
        jiraDomain: group ? group.jiraDomain : '',
        jiraProjectKey: group ? group.jiraProjectKey : '',
        jiraUserId: group ? group.jiraUserId : '',
      })
    }
  }, [isOpenJiraSettingForm, group])

  const setInitialGroupTodoInput = () => {
    setGroupTodoInput({
      title: '',
      content: '',
      predictedPomo: 1,
      teamId: groupSeq,
      userEmail: userInfo ? userInfo.email : '',
      workImportance: '???',
      workProficiency: '??????',
      workType: '??????',
    })
  }

  const openCreateGroupTodoForm = () => {
    setInitialGroupTodoInput()
    setIsOpenCreateTodo(true)
  }

  const onSelectTodo = (card: any) => {
    if (!selectedTodo) {
      setSelectedTodo({ ...card, seq: card.id })
    } else {
      if (selectedTodo.seq !== card.id) {
        setSelectedTodo({ ...card, seq: card.id })
      } else {
        setSelectedTodo(null)
      }
    }
  }

  const onClickStartTodoTimer = () => {
    if (selectedTodo && userInfo) {
      if (selectedTodo.activate === true) {
        alert('?????? ?????? ?????? ????????????!')
      } else if (selectedTodo.status === 'DONE') {
        alert('????????? ?????? ????????? ??? ????????????!')
        setSelectedTodo(null)
      } else if (selectedTodo.userEmail !== userInfo.email) {
        alert('????????? Todo??? ????????? ??? ????????????!')
        setSelectedTodo(null)
      } else {
        startTodoTimer(selectedTodo)
      }
    } else {
      alert('Todo??? ?????? ??????????????????.')
    }
  }

  const openModifyTodoForm = (card: any) => {
    if (card.activate === true) {
      alert('?????? ?????? ?????? ????????? ??? ????????????.')
      return
    }
    setModifyTodoId(card.id)
    setGroupTodoInput({
      title: card.title,
      content: card.content,
      predictedPomo: card.predictedPomo,
      teamId: groupSeq,
      userEmail: card.userEmail,
      workImportance: card.workImportance,
      workProficiency: card.workProficiency,
      workType: card.workType,
    })
    setIsOpenModifyTodo(true)
  }

  const closeCreateTodo = () => {
    setIsOpenCreateTodo(false)
  }

  const closeModifyTodo = () => {
    setIsOpenModifyTodo(false)
  }

  const openJiraSettingForm = () => {
    setIsOpenJiraSettingForm(true)
  }

  const closeJiraSettingForm = () => {
    setIsOpenJiraSettingForm(false)
  }

  const onChangeTodoTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setGroupTodoInput({ ...groupTodoInput, title: e.target.value })
  }

  const onChangeTodoContent = (e: ChangeEvent<HTMLInputElement>) => {
    setGroupTodoInput({ ...groupTodoInput, content: e.target.value })
  }

  const onChangeTodoPredictedPomo = (e: ChangeEvent<HTMLInputElement>) => {
    setGroupTodoInput({
      ...groupTodoInput,
      predictedPomo: Number(e.target.value),
    })
  }

  const onChangeTodoImportance = (e: SelectChangeEvent<string>) => {
    setGroupTodoInput({ ...groupTodoInput, workImportance: e.target.value })
  }

  const onChangeTodoProficiency = (e: SelectChangeEvent<string>) => {
    setGroupTodoInput({ ...groupTodoInput, workProficiency: e.target.value })
  }

  const onChangeTodoType = (e: SelectChangeEvent<string>) => {
    setGroupTodoInput({ ...groupTodoInput, workType: e.target.value })
  }

  const onChangeTodoUserEmail = (e: SelectChangeEvent<string>) => {
    setGroupTodoInput({ ...groupTodoInput, userEmail: e.target.value })
  }

  const onClickPredictPomo = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (userInfo && userInfo.birth) {
      let start_date = new Date()
      let end_date = new Date()
      start_date.setSeconds(
        start_date.getSeconds() - start_date.getTimezoneOffset() * 60
      )
      end_date.setSeconds(
        end_date.getSeconds() + 1500 - end_date.getTimezoneOffset() * 60
      )
      const predictData = {
        birth: userInfo.birth,
        end_time: end_date.toISOString(),
        gender: userInfo.gender,
        importance: groupTodoInput.workImportance,
        job: userInfo.job,
        mbti: userInfo.mbti,
        position: userInfo.position,
        proficiency: groupTodoInput.workProficiency,
        start_time: start_date.toISOString(),
        time_status: 'BASIC',
        type: groupTodoInput.workType,
      }
      const predictPomoResponse: any = await Api.post(
        `${BASE_URL}/api/todo/predict`,
        predictData
      )
      let realPredictPomo = 1
      if (predictPomoResponse.data.pred / 2 > 1) {
        realPredictPomo = Math.min(
          Math.round(predictPomoResponse.data.pred / 2),
          12
        )
      }
      setGroupTodoInput({
        ...groupTodoInput,
        predictedPomo: realPredictPomo,
      })
    }
  }

  const onSubmitCreateTodo = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    createTodo(groupTodoInput)
    setInitialGroupTodoInput()
    closeCreateTodo()
  }

  const onSubmitModifyTodo = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    modifyTodo(modifyTodoId, groupTodoInput)
    closeModifyTodo()
  }

  const onSubmitSettingJira = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // ?????? ?????? ??? ??????????????? ???????????? ??????
    if (
      jiraInfoInput.jiraAPIToken === '' ||
      jiraInfoInput.jiraDomain === '' ||
      jiraInfoInput.jiraProjectKey === '' ||
      jiraInfoInput.jiraUserId === ''
    ) {
      alert('????????? ???????????????.')
    } else {
      dispatch(
        modifyJiraInfoAsync.request({
          jiraData: jiraInfoInput,
          team_id: groupSeq,
        })
      )
      closeJiraSettingForm()
    }
  }

  const handleCardMove = (card: any, source: any, destination: any) => {
    if (card.activate === true) {
      alert('?????? ?????? ?????? ????????? ????????? ??? ????????????.')
      return
    }
    const updatedBoard = moveCard(board, source, destination)
    setBoard(updatedBoard)
    console.log('status change -> ', card.id)
    modifyTodoStatus(card.id, todoStatus[destination['toColumnId']])
    if (userTimer.selectedTodo) {
      if (
        todoStatus[destination['toColumnId']] === 'DONE' &&
        userTimer.selectedTodo.seq === card.id
      ) {
        dispatch(changeUserTimerTodo(null))
      }
    }
  }

  const handleCardRemove = (card: any) => {
    if (card.activate === true) {
      alert('?????? ?????? ?????? ????????? ??? ????????????.')
      return
    }
    setSelectedDeleteTodo(card.id)
  }

  const onChangeJiraApiToken = (e: ChangeEvent<HTMLInputElement>) => {
    setJiraInfoInput({ ...jiraInfoInput, jiraAPIToken: e.target.value })
  }

  const onChangeJiraDomain = (e: ChangeEvent<HTMLInputElement>) => {
    setJiraInfoInput({ ...jiraInfoInput, jiraDomain: e.target.value })
  }

  const onChangeJiraProjectKey = (e: ChangeEvent<HTMLInputElement>) => {
    setJiraInfoInput({ ...jiraInfoInput, jiraProjectKey: e.target.value })
  }

  const onChangeJiraUserId = (e: ChangeEvent<HTMLInputElement>) => {
    setJiraInfoInput({ ...jiraInfoInput, jiraUserId: e.target.value })
  }

  return (
    <>
      <Board
        sx={{ flexGrow: 1 }}
        allowRemoveCard
        onCardDragEnd={handleCardMove}
        onCardRemove={handleCardRemove}
        disableColumnDrag
        renderColumnHeader={(column: any) => (
          <>
            <Box sx={{ width: '100px' }}></Box>
            <Box
              key={column.id}
              sx={{
                textAlign: 'center',
                fontSize: '34px',
                fontWeight: 'bold',
                color: (theme) => theme.colors.greenText,
                mb: '14px',
              }}
            >
              {column.title}
            </Box>
            <Box sx={{ width: '100px' }}>
              {column.id === 0 && (
                <Tooltip title="Todo ??????">
                  <Fab
                    sx={{
                      color: (theme) => `${darken(0.5, theme.colors.todoCard)}`,
                      background: (theme) => theme.colors.doCard,
                      '&:hover': {
                        background: (theme) =>
                          `${darken(0.1, theme.colors.doCard)}`,
                      },
                      width: '34px',
                      height: '34px',
                      minHeight: '0px',
                      ml: '10px',
                      mt: '6px',
                    }}
                    aria-label="add"
                    onClick={openCreateGroupTodoForm}
                    size="small"
                  >
                    <AddIcon />
                  </Fab>
                </Tooltip>
              )}
            </Box>
          </>
        )}
        renderCard={(card: any, { dragging }: any) => (
          <Card
            key={card.id}
            sx={[
              {
                width: '330px',
                '@media (max-width: 1660px)': {
                  width: '290px',
                },
                height: '130px',
                '@media (max-height: 760px)': {
                  height: '115px',
                },
                cursor: 'pointer',
                borderRadius: '12px',
                mb: '1vh',
                p: '18px',
                background: (theme) => theme.colors.todoCard,
                '&:hover': {
                  background: (theme) => `${darken(0.05, theme.colors.doCard)}`,
                },
                '&:active': {
                  background: (theme) => `${darken(0.1, theme.colors.doCard)}`,
                },
              },
              card.id === (selectedTodo ? selectedTodo.seq : null) && {
                background: (theme) => `${darken(0.05, theme.colors.doCard)}`,
              },
            ]}
            onClick={() => onSelectTodo(card)}
          >
            <Grid container>
              <Grid item xs={10}>
                <Typography
                  sx={{
                    display: 'inline-block',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    fontFamily: 'MapoPeacefull, TmoneyRoundWindRegular',
                    color: (theme) => theme.colors.basicText,
                    width: '250px',
                    '@media (max-width: 1660px)': {
                      width: '210px',
                    },
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    '@media (max-height: 760px)': {
                      mb: 0,
                    },
                  }}
                  gutterBottom
                >
                  {card.title}
                </Typography>
              </Grid>
              <Grid item xs={2} sx={{ display: 'flex' }}>
                <EditIcon
                  sx={{
                    display: 'block',
                    ml: 'auto',
                    cursor: 'pointer',
                    fontSize: '26px',
                    color: (theme) => `${darken(0.2, theme.colors.gray)}`,
                    '&:hover': {
                      color: (theme) => `${darken(0.5, theme.colors.gray)}`,
                    },
                    '&:active': {
                      color: (theme) => `${darken(0.7, theme.colors.gray)}`,
                    },
                  }}
                  onClick={() => openModifyTodoForm(card)}
                />
                <CloseIcon
                  sx={{
                    display: 'block',
                    ml: 'auto',
                    cursor: 'pointer',
                    fontSize: '26px',
                    color: (theme) => `${darken(0.2, theme.colors.gray)}`,
                    '&:hover': {
                      color: (theme) => `${darken(0.4, theme.colors.gray)}`,
                    },
                    '&:active': {
                      color: (theme) => `${darken(0.6, theme.colors.gray)}`,
                    },
                  }}
                  onClick={() => handleCardRemove(card)}
                />
              </Grid>
            </Grid>
            <Box
              sx={{
                display: 'flex',
                mb: '1vh',
                fontSize: '14px',
                fontWeight: 'bold',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  color: (theme) => theme.colors.lightGreenText,
                  mr: '8px',
                }}
              >
                {`${card.realPomo / 2} / ${card.predictedPomo} ???`}{' '}
              </Box>
              <Box sx={{ mr: '3px', color: '#2f9e44' }}>
                {card.activate ? '?????????' : ''}
              </Box>
              {card.activate && (
                <CircularProgress
                  sx={{
                    width: '15px !important',
                    height: '15px !important',
                    color: '#2f9e44',
                  }}
                  disableShrink
                />
              )}
            </Box>
            <Grid container>
              <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
                <Chip
                  sx={{
                    color: (theme) => theme.colors.basicText,
                    fontWeight: 'bold',
                    fontFamily: 'MapoPeacefull, TmoneyRoundWindRegular',
                    background:
                      workTypeColors[workTypeList.indexOf(card.workType)],
                  }}
                  label={card.workType}
                  color="primary"
                  size="small"
                />
                {card.workImportance === '???' && (
                  <KeyboardDoubleArrowUpIcon
                    sx={{ fontSize: 26, color: '#FF7452' }}
                  />
                )}
                {card.workImportance === '??????' && (
                  <KeyboardArrowUpIcon
                    sx={{ fontSize: 26, color: '#FF7452' }}
                  />
                )}
                {card.workImportance === '???' && (
                  <DragHandleIcon sx={{ fontSize: 26, color: '#FFAB00' }} />
                )}
                {card.workImportance === '??????' && (
                  <KeyboardArrowDownIcon
                    sx={{ fontSize: 26, color: '#0065FF' }}
                  />
                )}
                {card.workImportance === '???' && (
                  <KeyboardDoubleArrowDownIcon
                    sx={{ fontSize: 26, color: '#0065FF' }}
                  />
                )}
              </Grid>
              <Grid
                item
                xs={6}
                sx={{
                  display: 'flex',
                  justifyContent: 'end',
                  alignItems: 'center',
                }}
              >
                <Tooltip title={`${card.userName} (${card.userEmail})`}>
                  <Avatar
                    sx={{ width: 28, height: 28, mr: '2px' }}
                    alt={`${card.userName} (${card.userEmail})`}
                    src={
                      card.userImg
                        ? card.userImg
                        : '/images/Profile_Default.png'
                    }
                  />
                </Tooltip>
              </Grid>
            </Grid>
          </Card>
        )}
      >
        {board}
      </Board>
      <Grid
        container
        sx={{
          display: 'flex',
          height: '100px',
          flexGrow: 1,
          p: 3,
          alignItems: 'end',
        }}
      >
        <Grid item xs={4}></Grid>
        <Grid item xs={4} sx={{ textAlign: 'center' }}>
          <Button
            sx={{
              fontSize: '30px',
              fontWeight: 'bold',
              fontFamily: 'MapoPeacefull, TmoneyRoundWindRegular',
              color: (theme) => theme.colors.lightGreenText,
            }}
            variant={'text'}
            color="success"
            onClick={onClickStartTodoTimer}
          >
            <span className={selectedTodo ? 'highlight on' : 'highlight'}>
              ????????? ?????? ????????????
            </span>
          </Button>
        </Grid>
        <Grid item xs={4} sx={{ textAlign: 'center' }}>
          {userInfo !== null &&
            group !== null &&
            userInfo.email === group.leaderEmail && (
              <Button
                sx={{
                  fontSize: '30px',
                  fontWeight: 'bold',
                  fontFamily: 'MapoPeacefull, TmoneyRoundWindRegular',
                  color: '#5c7cfa',
                }}
                variant={'text'}
                color="success"
                onClick={openJiraSettingForm}
              >
                <span>JIRA ?????? ????????????</span>
              </Button>
            )}
        </Grid>
      </Grid>
      <Dialog open={isOpenCreateTodo} onClose={closeCreateTodo}>
        <DialogTitle
          sx={{
            fontSize: '24px',
            fontWeight: 'bold',
            fontFamily: 'MapoPeacefull, TmoneyRoundWindRegular',
            p: '28px',
            pb: '4px',
            color: (theme) => theme.colors.greenText,
          }}
        >
          To Do ????????????
        </DialogTitle>
        <Box component="form" onSubmit={onSubmitCreateTodo}>
          <DialogContent>
            <Grid container>
              <Grid item xs={3}>
                <Box
                  sx={{
                    display: 'flex',
                    height: '56px',
                    ml: '10px',
                    mb: '14px',
                    justifyContent: 'start',
                    alignItems: 'center',
                    fontSize: '20px',
                    fontWeight: 'bold',
                  }}
                >
                  <div>??????</div>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    height: '125px',
                    pt: '6px',
                    ml: '10px',
                    mb: '14px',
                    justifyContent: 'start',
                    alignItems: 'start',
                    fontSize: '20px',
                    fontWeight: 'bold',
                  }}
                >
                  <div>??????</div>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    height: '56px',
                    ml: '10px',
                    mb: '14px',
                    justifyContent: 'start',
                    alignItems: 'center',
                    fontSize: '20px',
                    fontWeight: 'bold',
                  }}
                >
                  <div>?????????</div>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    height: '56px',
                    ml: '10px',
                    mb: '14px',
                    justifyContent: 'start',
                    alignItems: 'center',
                    fontSize: '20px',
                    fontWeight: 'bold',
                  }}
                >
                  <div>?????? ??????</div>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    height: '56px',
                    ml: '10px',
                    mb: '14px',
                    justifyContent: 'start',
                    alignItems: 'center',
                    fontSize: '20px',
                    fontWeight: 'bold',
                  }}
                >
                  <div>?????????</div>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    height: '56px',
                    ml: '10px',
                    mb: '14px',
                    justifyContent: 'start',
                    alignItems: 'center',
                    fontSize: '20px',
                    fontWeight: 'bold',
                  }}
                >
                  <div>?????????</div>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    height: '56px',
                    ml: '10px',
                    mb: '14px',
                    justifyContent: 'start',
                    alignItems: 'center',
                    fontSize: '20px',
                    fontWeight: 'bold',
                  }}
                >
                  <div>?????? ???</div>
                </Box>
              </Grid>
              <Grid item xs={9}>
                <TextField
                  required
                  fullWidth
                  id="title"
                  variant="outlined"
                  onChange={onChangeTodoTitle}
                  value={groupTodoInput.title}
                  color="success"
                  sx={{ mb: '14px' }}
                />
                <TextField
                  required
                  fullWidth
                  multiline
                  rows={4}
                  id="content"
                  variant="outlined"
                  onChange={onChangeTodoContent}
                  value={groupTodoInput.content}
                  color="success"
                  sx={{ mb: '14px' }}
                />
                <Select
                  required
                  fullWidth
                  id="user-email"
                  value={groupTodoInput.userEmail}
                  onChange={onChangeTodoUserEmail}
                  color="success"
                  sx={{
                    mb: '14px',
                    fontFamily: 'MapoPeacefull, TmoneyRoundWindRegular',
                    '> div': {
                      display: 'flex',
                      alignItems: 'center',
                    },
                  }}
                >
                  {group?.userList?.map((user, index) => (
                    <MenuItem
                      sx={{ display: 'flex' }}
                      key={index}
                      value={user.email}
                    >
                      <Avatar
                        sx={{
                          width: 26,
                          height: 26,
                          mr: '10px',
                          flexDirection: 'column',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'end',
                          boxShadow: 3,
                        }}
                        alt={`${user.name}`}
                        src={
                          user.image
                            ? user.image
                            : '/images/Profile_Default.png'
                        }
                      />
                      <Box
                        sx={{
                          fontFamily: 'MapoPeacefull, TmoneyRoundWindRegular',
                        }}
                      >{`${user.name} (${user.email})`}</Box>
                    </MenuItem>
                  ))}
                </Select>
                <Select
                  required
                  fullWidth
                  id="work-type"
                  value={groupTodoInput.workType}
                  onChange={onChangeTodoType}
                  color="success"
                  sx={{ mb: '14px' }}
                >
                  {workTypeList.map((workType, index) => (
                    <MenuItem key={index} value={workType}>
                      <Chip
                        sx={{
                          color: (theme) => theme.colors.basicText,
                          fontWeight: 'bold',
                          fontFamily: 'MapoPeacefull, TmoneyRoundWindRegular',
                          background: workTypeColors[index],
                        }}
                        label={workType}
                        color="primary"
                        size="small"
                      />
                    </MenuItem>
                  ))}
                </Select>
                <Select
                  required
                  fullWidth
                  id="work-importance"
                  value={groupTodoInput.workImportance}
                  onChange={onChangeTodoImportance}
                  color="success"
                  sx={{
                    mb: '14px',
                    '> div': {
                      display: 'flex',
                      alignItems: 'center',
                      fontFamily: 'MapoPeacefull, TmoneyRoundWindRegular',
                    },
                  }}
                >
                  {workImportanceList.map((workImportance, index) => (
                    <MenuItem
                      sx={{
                        fontFamily: 'MapoPeacefull, TmoneyRoundWindRegular',
                      }}
                      key={index}
                      value={workImportance}
                    >
                      {workImportance === '???' && (
                        <KeyboardDoubleArrowUpIcon
                          sx={{ fontSize: 22, color: '#FF7452' }}
                        />
                      )}
                      {workImportance === '??????' && (
                        <KeyboardArrowUpIcon
                          sx={{ fontSize: 22, color: '#FF7452' }}
                        />
                      )}
                      {workImportance === '???' && (
                        <DragHandleIcon
                          sx={{ fontSize: 22, color: '#FFAB00' }}
                        />
                      )}
                      {workImportance === '??????' && (
                        <KeyboardArrowDownIcon
                          sx={{ fontSize: 22, color: '#0065FF' }}
                        />
                      )}
                      {workImportance === '???' && (
                        <KeyboardDoubleArrowDownIcon
                          sx={{ fontSize: 22, color: '#0065FF' }}
                        />
                      )}
                      {workImportance}
                    </MenuItem>
                  ))}
                </Select>
                <Select
                  required
                  fullWidth
                  id="work-proficiency"
                  value={groupTodoInput.workProficiency}
                  onChange={onChangeTodoProficiency}
                  color="success"
                  sx={{
                    mb: '14px',
                    fontFamily: 'MapoPeacefull, TmoneyRoundWindRegular',
                  }}
                >
                  {workProficiencyList.map((workProficiency, index) => (
                    <MenuItem
                      sx={{
                        fontFamily: 'MapoPeacefull, TmoneyRoundWindRegular',
                      }}
                      key={index}
                      value={workProficiency}
                    >
                      {workProficiency}
                    </MenuItem>
                  ))}
                </Select>
                <Box sx={{ display: 'flex', mb: '14px' }}>
                  <TextField
                    required
                    fullWidth
                    type="number"
                    InputProps={{
                      inputProps: {
                        max: 12,
                        min: 1,
                      },
                      startAdornment: (
                        <InputAdornment position="start">
                          <CircleIcon
                            sx={{
                              width: '20px',
                              height: '20px',
                              color: (theme) =>
                                `${lighten(0.1, theme.colors.greenText)}`,
                              mr: '4px',
                            }}
                          />
                          <CloseIcon
                            sx={{
                              width: '18px',
                              height: '18px',
                              color: (theme) =>
                                `${lighten(0.3, theme.colors.greenText)}`,
                            }}
                          />
                        </InputAdornment>
                      ),
                    }}
                    onChange={onChangeTodoPredictedPomo}
                    value={groupTodoInput.predictedPomo}
                    color="success"
                    sx={{ mr: '12px' }}
                  />
                  {userInfo && userInfo.birth && (
                    <Box>
                      <Button
                        sx={{
                          width: '150px',
                          height: '56px',
                          fontSize: '20px',
                          fontFamily: 'MapoPeacefull, TmoneyRoundWindRegular',
                          color: (theme) => theme.colors.pageBg,
                          background: (theme) => theme.colors.greenButton,
                          borderRadius: '8px',
                        }}
                        variant="contained"
                        color="success"
                        onClick={onClickPredictPomo}
                      >
                        ??? ????????????
                      </Button>
                    </Box>
                  )}
                  {userInfo && !userInfo.birth && (
                    <Tooltip title="????????? ?????? ?????? ????????? ???????????????.">
                      <Box>
                        <Button
                          sx={{
                            width: '150px',
                            height: '56px',
                            fontSize: '20px',
                            fontFamily: 'MapoPeacefull, TmoneyRoundWindRegular',
                            color: (theme) => theme.colors.pageBg,
                            background: (theme) => theme.colors.greenButton,
                            borderRadius: '8px',
                          }}
                          variant="contained"
                          color="success"
                          disabled
                        >
                          ??? ????????????
                        </Button>
                      </Box>
                    </Tooltip>
                  )}
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: '0 24px 20px 24px' }}>
            <Button
              sx={{
                width: '22%',
                fontSize: '16px',
                fontFamily: 'MapoPeacefull, TmoneyRoundWindRegular',
                color: (theme) => theme.colors.pageBg,
                background: (theme) => theme.colors.greenButton,
                borderRadius: '8px',
                mr: '8px',
              }}
              variant="contained"
              color="success"
              type="submit"
            >
              ????????????
            </Button>
            <Button
              sx={{
                width: '22%',
                fontSize: '16px',
                fontFamily: 'MapoPeacefull, TmoneyRoundWindRegular',
                color: (theme) => theme.colors.pageBg,
                background: (theme) => theme.colors.gray,
                borderRadius: '8px',
              }}
              onClick={closeCreateTodo}
              variant="contained"
              color="success"
            >
              ??????
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
      <Dialog open={isOpenModifyTodo} onClose={closeModifyTodo}>
        <DialogTitle
          sx={{
            fontSize: '24px',
            fontWeight: 'bold',
            fontFamily: 'MapoPeacefull, TmoneyRoundWindRegular',
            p: '28px',
            pb: '4px',
            color: (theme) => theme.colors.greenText,
          }}
        >
          To Do ????????????
        </DialogTitle>
        <Box component="form" onSubmit={onSubmitModifyTodo}>
          <DialogContent>
            <Grid container>
              <Grid item xs={3}>
                <Box
                  sx={{
                    display: 'flex',
                    height: '56px',
                    ml: '10px',
                    mb: '14px',
                    justifyContent: 'start',
                    alignItems: 'center',
                    fontSize: '20px',
                    fontWeight: 'bold',
                  }}
                >
                  <div>??????</div>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    height: '125px',
                    pt: '6px',
                    ml: '10px',
                    mb: '14px',
                    justifyContent: 'start',
                    alignItems: 'start',
                    fontSize: '20px',
                    fontWeight: 'bold',
                  }}
                >
                  <div>??????</div>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    height: '56px',
                    ml: '10px',
                    mb: '14px',
                    justifyContent: 'start',
                    alignItems: 'center',
                    fontSize: '20px',
                    fontWeight: 'bold',
                  }}
                >
                  <div>?????????</div>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    height: '56px',
                    ml: '10px',
                    mb: '14px',
                    justifyContent: 'start',
                    alignItems: 'center',
                    fontSize: '20px',
                    fontWeight: 'bold',
                  }}
                >
                  <div>?????? ??????</div>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    height: '56px',
                    ml: '10px',
                    mb: '14px',
                    justifyContent: 'start',
                    alignItems: 'center',
                    fontSize: '20px',
                    fontWeight: 'bold',
                  }}
                >
                  <div>?????????</div>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    height: '56px',
                    ml: '10px',
                    mb: '14px',
                    justifyContent: 'start',
                    alignItems: 'center',
                    fontSize: '20px',
                    fontWeight: 'bold',
                  }}
                >
                  <div>?????????</div>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    height: '56px',
                    ml: '10px',
                    mb: '14px',
                    justifyContent: 'start',
                    alignItems: 'center',
                    fontSize: '20px',
                    fontWeight: 'bold',
                  }}
                >
                  <div>?????? ???</div>
                </Box>
              </Grid>
              <Grid item xs={9}>
                <TextField
                  required
                  fullWidth
                  id="title"
                  variant="outlined"
                  onChange={onChangeTodoTitle}
                  value={groupTodoInput.title}
                  color="success"
                  sx={{ mb: '14px' }}
                />
                <TextField
                  required
                  fullWidth
                  multiline
                  rows={4}
                  id="content"
                  variant="outlined"
                  onChange={onChangeTodoContent}
                  value={groupTodoInput.content}
                  color="success"
                  sx={{ mb: '14px' }}
                />
                <Select
                  required
                  fullWidth
                  id="user-email"
                  value={groupTodoInput.userEmail}
                  onChange={onChangeTodoUserEmail}
                  color="success"
                  sx={{
                    mb: '14px',
                    fontFamily: 'MapoPeacefull, TmoneyRoundWindRegular',
                    '> div': {
                      display: 'flex',
                      alignItems: 'center',
                    },
                  }}
                >
                  {group?.userList?.map((user, index) => (
                    <MenuItem
                      sx={{ display: 'flex' }}
                      key={index}
                      value={user.email}
                    >
                      <Avatar
                        sx={{
                          width: 26,
                          height: 26,
                          mr: '10px',
                          flexDirection: 'column',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'end',
                          boxShadow: 3,
                        }}
                        alt={`${user.name}`}
                        src={
                          user.image
                            ? user.image
                            : '/images/Profile_Default.png'
                        }
                      />
                      <Box
                        sx={{
                          fontFamily: 'MapoPeacefull, TmoneyRoundWindRegular',
                        }}
                      >{`${user.name} (${user.email})`}</Box>
                    </MenuItem>
                  ))}
                </Select>
                <Select
                  required
                  fullWidth
                  id="work-type"
                  value={groupTodoInput.workType}
                  onChange={onChangeTodoType}
                  color="success"
                  sx={{
                    mb: '14px',
                    fontFamily: 'MapoPeacefull, TmoneyRoundWindRegular',
                  }}
                >
                  {workTypeList.map((workType, index) => (
                    <MenuItem key={index} value={workType}>
                      <Chip
                        sx={{
                          color: (theme) => theme.colors.basicText,
                          fontWeight: 'bold',
                          fontFamily: 'MapoPeacefull, TmoneyRoundWindRegular',
                          background: workTypeColors[index],
                        }}
                        label={workType}
                        color="primary"
                        size="small"
                      />
                    </MenuItem>
                  ))}
                </Select>
                <Select
                  required
                  fullWidth
                  id="work-importance"
                  value={groupTodoInput.workImportance}
                  onChange={onChangeTodoImportance}
                  color="success"
                  sx={{
                    mb: '14px',
                    '> div': {
                      display: 'flex',
                      alignItems: 'center',
                      fontFamily: 'MapoPeacefull, TmoneyRoundWindRegular',
                    },
                  }}
                >
                  {workImportanceList.map((workImportance, index) => (
                    <MenuItem
                      sx={{
                        fontFamily: 'MapoPeacefull, TmoneyRoundWindRegular',
                      }}
                      key={index}
                      value={workImportance}
                    >
                      {workImportance === '???' && (
                        <KeyboardDoubleArrowUpIcon
                          sx={{ fontSize: 22, color: '#FF7452' }}
                        />
                      )}
                      {workImportance === '??????' && (
                        <KeyboardArrowUpIcon
                          sx={{ fontSize: 22, color: '#FF7452' }}
                        />
                      )}
                      {workImportance === '???' && (
                        <DragHandleIcon
                          sx={{ fontSize: 22, color: '#FFAB00' }}
                        />
                      )}
                      {workImportance === '??????' && (
                        <KeyboardArrowDownIcon
                          sx={{ fontSize: 22, color: '#0065FF' }}
                        />
                      )}
                      {workImportance === '???' && (
                        <KeyboardDoubleArrowDownIcon
                          sx={{ fontSize: 22, color: '#0065FF' }}
                        />
                      )}
                      {workImportance}
                    </MenuItem>
                  ))}
                </Select>
                <Select
                  required
                  fullWidth
                  id="work-proficiency"
                  value={groupTodoInput.workProficiency}
                  onChange={onChangeTodoProficiency}
                  color="success"
                  sx={{
                    mb: '14px',
                    fontFamily: 'MapoPeacefull, TmoneyRoundWindRegular',
                  }}
                >
                  {workProficiencyList.map((workProficiency, index) => (
                    <MenuItem
                      sx={{
                        fontFamily: 'MapoPeacefull, TmoneyRoundWindRegular',
                      }}
                      key={index}
                      value={workProficiency}
                    >
                      {workProficiency}
                    </MenuItem>
                  ))}
                </Select>
                <Box sx={{ display: 'flex', mb: '14px' }}>
                  <TextField
                    required
                    fullWidth
                    type="number"
                    InputProps={{
                      inputProps: {
                        max: 12,
                        min: 1,
                      },
                      startAdornment: (
                        <InputAdornment position="start">
                          <CircleIcon
                            sx={{
                              width: '20px',
                              height: '20px',
                              color: (theme) =>
                                `${lighten(0.1, theme.colors.greenText)}`,
                              mr: '4px',
                            }}
                          />
                          <CloseIcon
                            sx={{
                              width: '18px',
                              height: '18px',
                              color: (theme) =>
                                `${lighten(0.3, theme.colors.greenText)}`,
                            }}
                          />
                        </InputAdornment>
                      ),
                    }}
                    onChange={onChangeTodoPredictedPomo}
                    value={groupTodoInput.predictedPomo}
                    color="success"
                    sx={{ mr: '12px' }}
                  />
                  {userInfo && userInfo.birth && (
                    <Box>
                      <Button
                        sx={{
                          width: '150px',
                          height: '56px',
                          fontSize: '20px',
                          fontFamily: 'MapoPeacefull, TmoneyRoundWindRegular',
                          color: (theme) => theme.colors.pageBg,
                          background: (theme) => theme.colors.greenButton,
                          borderRadius: '8px',
                        }}
                        variant="contained"
                        color="success"
                        onClick={onClickPredictPomo}
                      >
                        ??? ????????????
                      </Button>
                    </Box>
                  )}
                  {userInfo && !userInfo.birth && (
                    <Tooltip title="????????? ?????? ?????? ????????? ???????????????.">
                      <Box>
                        <Button
                          sx={{
                            width: '150px',
                            height: '56px',
                            fontSize: '20px',
                            fontFamily: 'MapoPeacefull, TmoneyRoundWindRegular',
                            color: (theme) => theme.colors.pageBg,
                            background: (theme) => theme.colors.greenButton,
                            borderRadius: '8px',
                          }}
                          variant="contained"
                          color="success"
                          disabled
                        >
                          ??? ????????????
                        </Button>
                      </Box>
                    </Tooltip>
                  )}
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: '0 24px 20px 24px' }}>
            <Button
              sx={{
                width: '22%',
                fontSize: '16px',
                fontFamily: 'MapoPeacefull, TmoneyRoundWindRegular',
                color: (theme) => theme.colors.pageBg,
                background: (theme) => theme.colors.greenButton,
                borderRadius: '8px',
                mr: '8px',
              }}
              variant="contained"
              color="success"
              type="submit"
            >
              ????????????
            </Button>
            <Button
              sx={{
                width: '22%',
                fontSize: '16px',
                fontFamily: 'MapoPeacefull, TmoneyRoundWindRegular',
                color: (theme) => theme.colors.pageBg,
                background: (theme) => theme.colors.gray,
                borderRadius: '8px',
              }}
              onClick={closeModifyTodo}
              variant="contained"
              color="success"
            >
              ??????
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
      <Dialog
        open={Boolean(selectedDeleteTodo)}
        keepMounted
        onClose={() => setSelectedDeleteTodo(null)}
        aria-describedby="stop-dialog"
      >
        <DialogTitle
          sx={{
            fontSize: '24px',
            fontWeight: 'bold',
            fontFamily: 'MapoPeacefull, TmoneyRoundWindRegular',
            p: '18px',
            color: (theme) => theme.colors.greenText,
          }}
        >
          {'Todo ??????'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{
              fontSize: '16px',
              fontFamily: 'MapoPeacefull, TmoneyRoundWindRegular',
            }}
            id="stop-dialog"
          >
            ????????? ?????????????????????????
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ pb: '16px', pr: '16px' }}>
          <Button
            sx={{
              fontFamily: 'MapoPeacefull, TmoneyRoundWindRegular',
              color: (theme) => theme.colors.pageBg,
              background: (theme) => theme.colors.greenButton,
              borderRadius: '8px',
            }}
            variant="contained"
            color="success"
            onClick={() => {
              deleteTodo(selectedDeleteTodo)
              setSelectedDeleteTodo(null)
            }}
          >
            ??????
          </Button>
          <Button
            sx={{
              fontFamily: 'MapoPeacefull, TmoneyRoundWindRegular',
              color: (theme) => theme.colors.pageBg,
              background: (theme) => theme.colors.gray,
              borderRadius: '8px',
            }}
            variant="contained"
            color="success"
            onClick={() => setSelectedDeleteTodo(null)}
          >
            ??????
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={isOpenJiraSettingForm} onClose={closeJiraSettingForm}>
        <DialogTitle
          sx={{
            fontFamily: 'MapoPeacefull, TmoneyRoundWindRegular',
            fontSize: '28px',
          }}
        >
          Jira Setting
        </DialogTitle>
        <Box component="form" onSubmit={onSubmitSettingJira}>
          <DialogContent
            sx={{
              fontSize: '24px',
              fontWeight: 'bold',
              fontFamily: 'MapoPeacefull, TmoneyRoundWindRegular',
              px: '28px',
              py: '8px',
              color: (theme) => theme.colors.greenText,
            }}
          >
            <Grid container>
              <Grid item xs={4}>
                <Box
                  sx={{
                    display: 'flex',
                    height: '56px',
                    ml: '10px',
                    mb: '14px',
                    justifyContent: 'start',
                    alignItems: 'center',
                    fontSize: '20px',
                    fontWeight: 'bold',
                  }}
                >
                  <div>Jira Domain</div>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    height: '56px',
                    ml: '10px',
                    mb: '14px',
                    justifyContent: 'start',
                    alignItems: 'center',
                    fontSize: '20px',
                    fontWeight: 'bold',
                  }}
                >
                  <div>Jira User ID</div>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    height: '56px',
                    ml: '10px',
                    mb: '14px',
                    justifyContent: 'start',
                    alignItems: 'center',
                    fontSize: '20px',
                    fontWeight: 'bold',
                  }}
                >
                  <div>Jira API Token</div>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    height: '56px',
                    ml: '10px',
                    mb: '14px',
                    justifyContent: 'start',
                    alignItems: 'center',
                    fontSize: '20px',
                    fontWeight: 'bold',
                  }}
                >
                  <div>Jira Project Key</div>
                </Box>
              </Grid>
              <Grid item xs={8}>
                <TextField
                  required
                  fullWidth
                  id="jiraDomain"
                  variant="outlined"
                  onChange={onChangeJiraDomain}
                  value={jiraInfoInput.jiraDomain}
                  color="success"
                  sx={{ mb: '14px' }}
                />

                <TextField
                  required
                  fullWidth
                  id="jiraDomain"
                  variant="outlined"
                  onChange={onChangeJiraUserId}
                  value={jiraInfoInput.jiraUserId}
                  color="success"
                  sx={{ mb: '14px' }}
                />

                <TextField
                  required
                  fullWidth
                  id="jiraDomain"
                  variant="outlined"
                  onChange={onChangeJiraApiToken}
                  value={jiraInfoInput.jiraAPIToken}
                  color="success"
                  sx={{ mb: '14px' }}
                />

                <TextField
                  required
                  fullWidth
                  id="jiraDomain"
                  variant="outlined"
                  onChange={onChangeJiraProjectKey}
                  value={jiraInfoInput.jiraProjectKey}
                  color="success"
                  sx={{ mb: '14px' }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: '0 24px 20px 24px' }}>
            <Button
              sx={{
                width: '22%',
                fontSize: '16px',
                fontFamily: 'MapoPeacefull, TmoneyRoundWindRegular',
                color: (theme) => theme.colors.pageBg,
                background: (theme) => theme.colors.greenButton,
                borderRadius: '8px',
                mr: '8px',
              }}
              variant="contained"
              color="success"
              type="submit"
            >
              ????????????
            </Button>
            <Button
              sx={{
                width: '22%',
                fontSize: '16px',
                fontFamily: 'MapoPeacefull, TmoneyRoundWindRegular',
                color: (theme) => theme.colors.pageBg,
                background: (theme) => theme.colors.gray,
                borderRadius: '8px',
              }}
              onClick={closeJiraSettingForm}
              variant="contained"
              color="success"
            >
              ??????
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  )
}

export default GroupTodoComponent
