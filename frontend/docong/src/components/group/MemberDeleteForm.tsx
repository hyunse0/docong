import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Group, GroupMemberModifyData2 } from "../../api/group"
import { RootState } from "../../modules"

interface MemberDeleteFormProps {
    group: Group|null
    isOpenMemberDeleteForm: boolean
    closeMemberDeleteForm: () => void
    onMemberDeleteSubmit: (groupMemberModifyData: GroupMemberModifyData2) => void
}

function MemberDeleteForm({
    group,
    isOpenMemberDeleteForm,
    closeMemberDeleteForm,
    onMemberDeleteSubmit
}: MemberDeleteFormProps) {
    const userInfo = useSelector((state:RootState) => state.user.userInfo.data)

    const [deleteMemberInfo, setDeleteMemberInfo] = useState({
        team_id: group?group.teamSeq:0,
        user_email: userInfo?userInfo.email:''
    })

    useEffect(() => {
        setDeleteMemberInfo({team_id: group?group.teamSeq:0, user_email:userInfo?userInfo.email:''})
    },[group])

    const onSubmitMemberDelete = () => {
        onMemberDeleteSubmit(deleteMemberInfo)
    }

    return(
        <>
            <Dialog open={isOpenMemberDeleteForm} onClose={closeMemberDeleteForm}>
                <DialogTitle>정말 그룹에서 탈퇴하시겠습니까?</DialogTitle>
                <DialogActions sx={{ p: '0 100px 20px 100px' }}>
                <Button
                    sx={{
                        width: '50%',
                        fontSize: '16px',
                        color: (theme) => theme.colors.pageBg,
                        background: (theme) => theme.colors.greenButton,
                        borderRadius: '8px',
                        mr: '80px',
                    }}
                    onClick={onSubmitMemberDelete}
                    variant="contained"
                    color="success"
                    type="submit"
                >
                    탈퇴하기
                </Button>
                    <Button
                        sx={{
                            width: '50%',
                            fontSize: '16px',
                            color: (theme) => theme.colors.pageBg,
                            background: (theme) => theme.colors.gray,
                            borderRadius: '8px',
                        }}
                        onClick={closeMemberDeleteForm}
                        variant="contained"
                        color="success"
                    >
                        CANCLE
                    </Button>
            </DialogActions>
            </Dialog>
        </>
    )
}

export default MemberDeleteForm