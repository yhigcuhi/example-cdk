/* import aws cdk */
import { Fn } from 'aws-cdk-lib';
import { Role, ServicePrincipal, ManagedPolicy } from 'aws-cdk-lib/aws-iam';
/* import ポリシー */
import IamRoleLambdaExecutionPolicy from './poricy/IamRoleLambdaExecutionPolicy';
/* import 定数 */
import { APP_NAME, APP_ENV} from '@/config/app';
/* import type */
import type { RoleProps, PolicyProps } from 'aws-cdk-lib/aws-iam';
import type { Construct } from 'constructs';

/**
 * ポリシー設定である判定
 * @param val 判定値
 * @returns {boolean} true: ポリシー設定 / false: それ以外
 */
const isPolicyProps = (val: object = {}): val is PolicyProps => val.hasOwnProperty('statements');

/**
 * @class Lambda が実行する際の role設定
 */
export default class IamRoleLambdaExecution extends Role {
    /**
     * コンストラクタ
     * @param scope 作成するstackとか タスクを実行する元
     * @param id 識別子
     * @param props ロールの設定 または ポリシー設定
     * @param policyProps ついでのポリシー設定
     */
    constructor(scope: Construct, id: string, props?: RoleProps|PolicyProps, policyProps?: PolicyProps) {
        // 入力補完
        const _props: RoleProps|undefined = isPolicyProps(props) ? void 0 : props;
        // super拡張
        super(scope, id, {
            ...(_props ?? {}),
            roleName: _props?.roleName || Fn.join('-', [APP_NAME, APP_ENV, 'lambdaRole']), // 独自 ロール名 = アプリ名-ステージング-lambdaRole
            assumedBy: _props?.assumedBy ?? new ServicePrincipal('lambda.amazonaws.com'),
            managedPolicies: [ // 利用する ポリシー
                ...(_props?.managedPolicies ?? []), // 継承
                ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'), // lambdaとして の基本的な role セット(cloud watch書き込みなど)
            ],
        });
        // ポリシー設定
        this.attachInlinePolicy(new IamRoleLambdaExecutionPolicy(this, `${id}Policy`, isPolicyProps(props) ? props : policyProps));
    }
}