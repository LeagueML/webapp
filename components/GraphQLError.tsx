import { CombinedError } from "urql";

export default function GraphQLError(props : { error: CombinedError}) {
    return <>
        Oh no... {props.error.message}
    </>
}