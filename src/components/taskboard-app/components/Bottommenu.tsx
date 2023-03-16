import React from 'react'
import style from "../clockapp.module.scss"
import { IoCashOutline, IoChatboxEllipses, IoChatboxOutline, IoDocumentsOutline, IoInformation, IoInformationCircle, IoInformationCircleOutline, IoSettingsOutline, IoSwapHorizontal, IoTicketOutline } from 'react-icons/io5'
import { GenIcon, IconBase, IconTree, IconType } from 'react-icons'
import { BsBoxes } from 'react-icons/bs'
import rismIcon from '../../../assets/rism-icon.json'


function Bottommenu() {
  return (
    <div style={{display: "flex"}}>
    <div className={style.bottomMenu}>
      <BTN title='Transfers' icon={IoSwapHorizontal} action={() => { }} />
      <BTN title='Shipments' icon={BsBoxes} action={() => {}}/>
      <BTN title='Deposits' icon={IoCashOutline} action={() => { }} />
      <BTN title='Documents' icon={IoDocumentsOutline} action={() => { }} />
      <BTN title='Ticket Issue' icon={IoTicketOutline} action={() => { }} />
        <BTN title='RISM' icon={ GenIcon(rismIcon as any)} action={() => {}}/>
      {/* <BTN title='Info' icon={IoInformationCircleOutline} action={() => { }} />
      <BTN title='Settings' icon={IoSettingsOutline} action={() => {}}/> */}
      </div>
      <div style={{display: 'flex', height: "100%", width: "40%", alignItems: "center", justifyContent: "center", whiteSpace: "nowrap", color: "gray"}}>
        COPYRIGHT © 2023 METE SOLUTIONS INC.
      </div>
    </div>
  )
}

const BTN = (props: {
  title: string
  icon: IconType
  action: () => void
}) => {

  return (
    <div className={style.bottomMenuOption} onClick={props.action}>
      {<props.icon style={{ fontSize: "2.5em" }} />}
      <div style={{fontSize: "0.7em", color: "gray"}}>{props.title}</div>
    </div>
  )
}

export default Bottommenu