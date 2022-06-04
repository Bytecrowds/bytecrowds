import Head from "next/head";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
const Editor = dynamic(() => import("../components/editor"), {
    ssr: false
});

export async function getServerSideProps(context) {
    const { id } = context.query;
    const databaseServer = process.env.NEXT_PUBLIC_DATABASE_SERVER;

    let _text1 = await fetch(databaseServer + "/get/" + id);
    let editorText = await _text1.text();

    let _text2 = await fetch(databaseServer + "/getLanguage/" + id);
    let editorInitialLanguage = await _text2.text();

    if (editorInitialLanguage === "") {
        editorInitialLanguage = "javascript()";
    }

    return {
        props: {
            editorText,
            editorInitialLanguage
        }
    }
}



const Bytecrowd = ({ editorText, editorInitialLanguage }) => {
    const { id } = useRouter().query;

    return (
        <>
            <Head>
                <title>Bytecrowd editor - {id}</title>
            </Head>
            <Editor
                id={id}
                editorText={editorText}
                editorInitialLanguage={editorInitialLanguage}>
            </Editor>
        </>
    )
};


export default Bytecrowd;