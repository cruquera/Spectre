import { z } from 'zod';
export declare const ipcResultSchema: <T extends z.ZodTypeAny>(dataSchema: T) => z.ZodDiscriminatedUnion<"success", [z.ZodObject<{
    success: z.ZodLiteral<true>;
    data: T;
}, "strip", z.ZodTypeAny, z.objectUtil.addQuestionMarks<z.baseObjectOutputType<{
    success: z.ZodLiteral<true>;
    data: T;
}>, any> extends infer T_1 ? { [k in keyof T_1]: T_1[k]; } : never, z.baseObjectInputType<{
    success: z.ZodLiteral<true>;
    data: T;
}> extends infer T_2 ? { [k_1 in keyof T_2]: T_2[k_1]; } : never>, z.ZodObject<{
    success: z.ZodLiteral<false>;
    error: z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        code: string;
        message: string;
    }, {
        code: string;
        message: string;
    }>;
}, "strip", z.ZodTypeAny, {
    success: false;
    error: {
        code: string;
        message: string;
    };
}, {
    success: false;
    error: {
        code: string;
        message: string;
    };
}>]>;
export type IpcResult<T> = {
    success: true;
    data: T;
} | {
    success: false;
    error: {
        code: string;
        message: string;
    };
};
export declare const healthcheckResponseSchema: z.ZodObject<{
    status: z.ZodLiteral<"ok">;
    version: z.ZodString;
    timestamp: z.ZodString;
}, "strip", z.ZodTypeAny, {
    status: "ok";
    version: string;
    timestamp: string;
}, {
    status: "ok";
    version: string;
    timestamp: string;
}>;
export type HealthcheckResponse = z.infer<typeof healthcheckResponseSchema>;
//# sourceMappingURL=common.d.ts.map