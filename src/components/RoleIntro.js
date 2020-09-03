import React from 'react';

import fangzhen from '../assets/fangzhen.svg';
import huangyanyan from '../assets/huangyanyan.svg';
import jiyunfu from '../assets/jiyunfu.svg';
import laochaofeng from '../assets/laochaofeng.svg';
import muhujianai from '../assets/muhujianai.svg';
import xuyuan from '../assets/xuyuan.svg';
import yaoburan from '../assets/yaoburan.svg';
import zhengguoqu from '../assets/zhengguoqu.svg';

import styles from './RoleIntro.module.css';


const RoleIntro = (props) => {
  let roleNum = props.roles.length;
  const roleNumMap = {
    6: '六',
    7: '七',
    8: '八'
  };
  const roleMap = {
    6: {
      0: ['许愿', '方震', '黄烟烟', '木户加奈'],
      1: ['老朝奉', '药不然'],
    },
    7: {
      0: ['许愿', '方震', '黄烟烟', '木户加奈'],
      1: ['老朝奉', '药不然', '郑国渠'],
    },
    8: {
      0: ['许愿', '方震', '黄烟烟', '木户加奈', '姬云浮'],
      1: ['老朝奉', '药不然', '郑国渠'],
    },
  };

  const roleNameMap = {
    '许愿': xuyuan,
    '方震': fangzhen,
    '黄烟烟': huangyanyan,
    '木户加奈': muhujianai,
    '老朝奉': laochaofeng,
    '药不然': yaoburan,
    '郑国渠': zhengguoqu,
    '姬云浮': jiyunfu,
  }

  const roleIntroMap = {
    '许愿': [
      '超级鉴宝师 - 每轮可检验两个兽首',
      '会被方震牵连 - 如果方震被偷袭，则许愿也不能鉴宝, 显示信息为被药不然偷袭',
      '攻略 - 尽量隐藏自己身份，指认环节若被指认失败，则好人阵营 +2',
    ],
    '方震': [
      '警察 - 不可查验兽首，但每轮可以查验一位玩家所属阵营',
      '攻略 - 尽量隐藏自己身份，指认环节若被指认失败，则好人阵营 +1',
    ],
    '黄烟烟': [
      '普通鉴宝师 - 每轮可检验一个兽首',
      '技能不稳定 - 每局游戏会有一轮技能失效，无法查验兽首，显示信息为无法查验',
      '攻略 - 寻找同伴，尽量帮助许愿和方震隐藏身份',
    ],
    '木户加奈': [
      '普通鉴宝师 - 每轮可检验一个兽首',
      '技能不稳定 - 每局游戏会有一轮技能失效，无法查验兽首，显示信息为无法查验',
      '攻略 - 寻找同伴，尽量帮助许愿和方震隐藏身份',
    ],
    '老朝奉': [
      '坏人老大 - 每轮可以检验一个兽首',
      '掉包 - 每轮可以选择是否调换兽首真假，该轮之后的玩家鉴定真兽首为假，假兽首为真',
      '攻略 - 尽量隐藏自己的身份，同时识别许愿'
    ],
    '药不然': [
      '坏人小弟 - 与老朝奉互相知道身份，每轮可以检验一个兽首',
      '偷袭 - 每轮可以选择一位玩家偷袭使其技能失效，偷袭效果可以顺延，如果偷袭方震，许愿被连带失效',
      '攻略 - 通过发言识别方震，偷袭方震有连带效果'
    ],
    '郑国渠': [
      '隐藏坏人 - 与老朝奉和药不然不认识，每轮可以检验一个兽首',
      '隐藏 - 每轮可以选择一个兽首进行隐藏，之后的玩家不能检验该兽首，显示信息为无法查验',
      '攻略 - 通过发言识别坏人队友，尽量使其在有利位置行动'
    ],
    '姬云浮': [
      '资深鉴宝师 - 每轮检验一个兽首，鉴宝结果不受坏人阵营影响',
      '技能脆弱 - 如果被药不然偷袭，则当前及之后的轮次都将无法鉴定',
      '攻略 - 隐藏身份的同时帮助好人阵营保护真实兽首',
    ],
  }

  return (
    <div className={styles.Container}>
      <h1>{roleNumMap[roleNum]}人局角色技能介绍</h1>
      <div className={styles.RoleContainer}>
        <h1>好人阵营</h1>
        <div className={styles.GroupContainer}>
          {
            roleMap[roleNum][0].map((role, index) => {
              return (
                <div className={styles.RoleCard} key={index}>
                  <img src={roleNameMap[role]} />
                  <h1>{role}</h1>
                  {
                    roleIntroMap[role].map((el, index) => {
                      return(
                        <p key={index}><span className={styles.Num}>{index + 1}:</span>{el}</p>
                      );
                    })
                  }
                </div>
              )

            })
          }
        </div>

        <h1>坏人阵营</h1>
        <div className={styles.GroupContainer}>
          {
            roleMap[roleNum][1].map((role, index) => {
              return (
                <div className={styles.RoleCard} key={index}>
                  <img src={roleNameMap[role]} />
                  <h1>{role}</h1>
                  {
                    roleIntroMap[role].map((el, index) => {
                      return(
                        <p key={index}><span className={styles.Num}>{index + 1}</span>: {el}</p>
                      );
                    })
                  }
                </div>
              )

            })
          }

        </div>
      </div>


    </div>
  )
}

export default RoleIntro;
