import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";

interface DynamicFormModalProps<T = any> {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: T) => Promise<void>;
  title: string;
  icon?: ReactNode;
  initialData?: T;
  formSteps?: {
    title: string;
    fields: ReactNode;
    validation?: (data: T) => Record<string, string>;
  }[];
  singleStepForm?: ReactNode;
}

export const DynamicFormModal = <T extends Record<string, any>>({
  isOpen,
  onClose,
  onSubmit,
  title,
  icon,
  initialData,
  formSteps,
  singleStepForm,
}: DynamicFormModalProps<T>) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<T>(initialData || {} as T);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      setFormData(initialData || {} as T);
      setErrors({});
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formSteps) {
      const stepValidation = formSteps[currentStep].validation;
      if (stepValidation) {
        const validationErrors = stepValidation(formData);
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
          return;
        }
      }

      if (currentStep < formSteps.length - 1) {
        setCurrentStep(currentStep + 1);
        return;
      }
    }

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 rounded-t-xl p-6 flex justify-between items-center z-10">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                {icon}
                {formSteps ? formSteps[currentStep].title : title}
              </h3>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmit}>
                {singleStepForm ? (
                  singleStepForm
                ) : (
                  <>
                    {formSteps && formSteps[currentStep].fields}
                    <div className="mt-8 flex justify-between">
                      {currentStep > 0 && (
                        <button
                          type="button"
                          onClick={() => setCurrentStep(currentStep - 1)}
                          className="px-6 py-2.5 border border-gray-300 rounded-lg"
                        >
                          Back
                        </button>
                      )}
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-lg"
                      >
                        {formSteps && currentStep < formSteps.length - 1 ? "Continue" : "Submit"}
                      </button>
                    </div>
                  </>
                )}
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};