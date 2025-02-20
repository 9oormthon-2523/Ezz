import Link from "next/link"
import { AnchorHTMLAttributes } from "react"

/**
 * Studio 페이지를 제외한 모든 페이지가 사용하는 footer
 * 페이지 별 스타일이 달라서 Footer위에 전용 <div>를 감싸서 mt를 조절해 사용하는 것을 권장합니다
 */

const Footer = () => {
    const footerList = [
        {
            title:"EZZ",
            url:"#"
        },
        {
            title:"김동균",
            url:"https://github.com/DonggyunKim00"
        },
        {
            title:"안리안",
            url:"https://github.com/AhnRian"
        },{
            title:"윤가은",
            url:"https://github.com/yungan9"
        },{
            title:"김기준",
            url:"https://github.com/ki2183"
        },
    ];

    return (
        
        <footer aria-label="footer" className="w-full">
                <ul id="footer-contents" className="text-center">
                    {footerList.map(({ title, url }, idx) => (
                        <FooterItem key={idx} url={url}>{title}</FooterItem>
                    ))}
                    
                    <FooterItem key="lastItem" url="https://github.com/9oormthon-2523/chzzk-clone" lastIdx={true}>
                        <strong>ⓣ 2523.</strong>
                    </FooterItem>
                    
                </ul>
        </footer>  
    );
};

export default Footer;


interface FooterItemProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    lastIdx?:boolean;
    url:string;
};

const FooterItem = (props: FooterItemProps) =>{
    const { url, lastIdx, ...rest} = props;
    const afterStyle = "after:content-[''] after:absolute after:top-[7px] after:bottom-[7px] after:right-0 after:w-[1px] after:bg-[#6666667d]"
    return (
        <li className={`${!lastIdx ? afterStyle : " "} text-[#666] inline-block text-[12px] leading-[15px] p-[5px_11px_5px_10px] relative align-top hover:underline decoration-gray-500`}>
            <Link {...rest} href={url}/>
        </li>
    );
};